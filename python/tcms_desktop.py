# -*- coding: utf-8 -*-
"""
TRAINING COMPLIANCE MANAGEMENT SYSTEM (TCMS)
Production-grade desktop application using CustomTkinter, Pandas, and SQLite.

Author: Senior Python Software Engineer & HR Analytics Expert
"""

import os
import sys
import json
import sqlite3
import logging
import datetime
import pandas as pd
import customtkinter as ctk
from tkinter import filedialog, messagebox, ttk
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
from openpyxl import Workbook
from openpyxl.styles import Font, Alignment, PatternFill, Border, Side
from openpyxl.utils import get_column_letter

# Set theme and styling
ctk.set_appearance_mode("Light")
ctk.set_default_color_theme("blue")

# Setup logging
logging.basicConfig(
    filename='tcms_execution.log',
    filemode='a',
    format='%(asctime)s - %(levelname)s - %(message)s',
    level=logging.INFO
)

DB_FILE = "tcms_database.db"
CONFIG_FILE = "tcms_config.json"


def init_database():
    """Initializes SQLite database and tables."""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    # 1. Training Records
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS training_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_name TEXT,
        service_no TEXT,
        vertical TEXT,
        category TEXT,
        code TEXT,
        title TEXT,
        status TEXT,
        imported_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)
    
    # 2. Category A registers
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS category_a_data (
        service_no TEXT PRIMARY KEY,
        completed_count INTEGER,
        source TEXT, -- 'import' or 'manual'
        updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)
    
    # 3. Completion Policy
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS completion_policy (
        key TEXT PRIMARY KEY,
        value INTEGER
    )
    """)
    
    # Pre-populate default policy if empty
    cursor.execute("SELECT COUNT(*) FROM completion_policy")
    if cursor.fetchone()[0] == 0:
        defaults = [
            ('Fundamental', 6),
            ('Category A', 4),
            ('Category B', 5),
            ('Category C', 8),
            ('Category D', 3)
        ]
        cursor.executemany("INSERT INTO completion_policy (key, value) VALUES (?, ?)", defaults)
        
    conn.commit()
    conn.close()
    logging.info("SQLite Database successfully initialized.")


class TCMSModel:
    """Calculations and Business Logic layer."""
    
    @staticmethod
    def get_policy():
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute("SELECT key, value FROM completion_policy")
        policy = {row[0]: row[1] for row in cursor.fetchall()}
        conn.close()
        return policy

    @staticmethod
    def update_policy(policy_dict):
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        for key, value in policy_dict.items():
            cursor.execute("INSERT OR REPLACE INTO completion_policy (key, value) VALUES (?, ?)", (key, value))
        conn.commit()
        conn.close()
        logging.info("Policy updated.")

    @staticmethod
    def get_category_a_overrides():
        conn = sqlite3.connect(DB_FILE)
        df = pd.read_sql_query("SELECT service_no, completed_count, source FROM category_a_data", conn)
        conn.close()
        return df

    @staticmethod
    def save_category_a_override(service_no, count, source='manual'):
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute("""
            INSERT OR REPLACE INTO category_a_data (service_no, completed_count, source, updated_on) 
            VALUES (?, ?, ?, CURRENT_TIMESTAMP)
        """, (service_no, count, source))
        conn.commit()
        conn.close()
        logging.info(f"Category A manual override saved for employee: {service_no} with count: {count}")

    @staticmethod
    def import_training_excel(filepath):
        """Imports training record excel, runs validations and loads into SQLite."""
        try:
            df = pd.read_excel(filepath)
            # Standard mapping checks
            required_cols = ['Employee Name', 'Service No', 'Vertical', 'Training Category', 'Training Code', 'Training Title', 'Status']
            missing_cols = [col for col in required_cols if col not in df.columns]
            
            if missing_cols:
                raise ValueError(f"Spreadsheet is missing required columns: {missing_cols}")
                
            # Filter blank lines
            df = df.dropna(subset=['Service No', 'Training Category', 'Training Code'])
            
            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()
            
            # Wipe older table
            cursor.execute("DELETE FROM training_records")
            
            for _, row in df.iterrows():
                cursor.execute("""
                    INSERT INTO training_records (employee_name, service_no, vertical, category, code, title, status)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                """, (
                    str(row['Employee Name']).strip(),
                    str(row['Service No']).strip(),
                    str(row['Vertical']).strip(),
                    str(row['Training Category']).strip(),
                    str(row['Training Code']).strip(),
                    str(row['Training Title']).strip(),
                    str(row['Status']).strip()
                ))
            conn.commit()
            conn.close()
            logging.info(f"Loaded {len(df)} records into SQLite.")
            return len(df), []
        except Exception as e:
            logging.error(f"Failed to import training records Excel: {e}")
            raise e

    @staticmethod
    def import_category_a_excel(filepath):
        """Imports Category A counts file."""
        try:
            df = pd.read_excel(filepath)
            # Find service no and count
            service_col = [col for col in df.columns if 'service' in col.lower() or 'no' in col.lower()][0]
            count_col = [col for col in df.columns if 'completed' in col.lower() or 'count' in col.lower() or 'a' in col.lower()][0]
            
            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()
            
            for _, row in df.iterrows():
                service_no = str(row[service_col]).strip()
                count = int(row[count_col])
                
                # Check if manual override already exists. Import should NOT overwrite manual choices.
                cursor.execute("SELECT source FROM category_a_data WHERE service_no = ?", (service_no,))
                existing = cursor.fetchone()
                if not existing or existing[0] != 'manual':
                    cursor.execute("""
                        INSERT OR REPLACE INTO category_a_data (service_no, completed_count, source, updated_on)
                        VALUES (?, ?, 'import', CURRENT_TIMESTAMP)
                    """, (service_no, count))
            conn.commit()
            conn.close()
            logging.info("Category A registers updated.")
            return len(df)
        except Exception as e:
            logging.error(f"Failed to import Category A Excel: {e}")
            raise e

    @classmethod
    def calculate_compliance_report(cls):
        """Builds compliance metrics per employee."""
        policy = cls.get_policy()
        conn = sqlite3.connect(DB_FILE)
        
        # Load unique employees
        employees_df = pd.read_sql_query("""
            SELECT DISTINCT employee_name, service_no, vertical 
            FROM training_records 
            WHERE service_no IS NOT NULL AND service_no != ''
        """, conn)
        
        # Load passed unique courses (Status = Pass)
        passed_df = pd.read_sql_query("""
            SELECT DISTINCT service_no, category, code
            FROM training_records
            WHERE LOWER(status) = 'pass'
        """, conn)
        
        # Load Category A
        cat_a_df = pd.read_sql_query("SELECT service_no, completed_count FROM category_a_data", conn)
        cat_a_map = dict(zip(cat_a_df['service_no'], cat_a_df['completed_count']))
        
        results = []
        for _, emp in employees_df.iterrows():
            s_no = emp['service_no']
            
            # Filter passed records
            emp_passed = passed_df[passed_df['service_no'] == s_no]
            
            # Group sizes
            fun_passed = len(emp_passed[emp_passed['category'].str.lower().str.contains('fundamental', na=False)])
            cat_a_passed = cat_a_map.get(s_no, 0)
            cat_b_passed = len(emp_passed[emp_passed['category'].str.lower().str.contains('category b', na=False)])
            cat_c_passed = len(emp_passed[emp_passed['category'].str.lower().str.contains('category c', na=False)])
            cat_d_passed = len(emp_passed[emp_passed['category'].str.lower().str.contains('category d', na=False)])
            
            # Policy requireds
            fun_req = policy.get('Fundamental', 6)
            a_req = policy.get('Category A', 4)
            b_req = policy.get('Category B', 5)
            c_req = policy.get('Category C', 8)
            d_req = policy.get('Category D', 3)
            
            # Remaining caps
            fun_rem = max(0, fun_req - fun_passed)
            a_rem = max(0, a_req - cat_a_passed)
            b_rem = max(0, b_req - cat_b_passed)
            c_rem = max(0, c_req - cat_c_passed)
            d_rem = max(0, d_req - cat_d_passed)
            
            # Capped compliance summing
            cap_fun = min(fun_passed, fun_req)
            cap_a = min(cat_a_passed, a_req)
            cap_b = min(cat_b_passed, b_req)
            cap_c = min(cat_c_passed, c_req)
            cap_d = min(cat_d_passed, d_req)
            
            total_passed = cap_fun + cap_a + cap_b + cap_c + cap_d
            total_required = fun_req + a_req + b_req + c_req + d_req
            
            overall_pct = (total_passed / total_required) * 100 if total_required > 0 else 100.0
            
            is_compliant = (fun_passed >= fun_req and cat_a_passed >= a_req and 
                            cat_b_passed >= b_req and cat_c_passed >= c_req and cat_d_passed >= d_req)
            
            results.append({
                'Employee Name': emp['employee_name'],
                'Service No': s_no,
                'Vertical': emp['vertical'],
                'Fundamental Passed': fun_passed,
                'Fundamental Required': fun_req,
                'Fundamental Remaining': fun_rem,
                'Fundamental Compliance %': (cap_fun / fun_req * 100) if fun_req > 0 else 100.0,
                'Category A Passed': cat_a_passed,
                'Category A Required': a_req,
                'Category A Remaining': a_rem,
                'Category A Compliance %': (cap_a / a_req * 100) if a_req > 0 else 100.0,
                'Category B Passed': cat_b_passed,
                'Category B Required': b_req,
                'Category B Remaining': b_rem,
                'Category B Compliance %': (cap_b / b_req * 100) if b_req > 0 else 100.0,
                'Category C Passed': cat_c_passed,
                'Category C Required': c_req,
                'Category C Remaining': c_rem,
                'Category C Compliance %': (cap_c / c_req * 100) if c_req > 0 else 100.0,
                'Category D Passed': cat_d_passed,
                'Category D Required': d_req,
                'Category D Remaining': d_rem,
                'Category D Compliance %': (cap_d / d_req * 100) if d_req > 0 else 100.0,
                'Total Passed': fun_passed + cat_a_passed + cat_b_passed + cat_c_passed + cat_d_passed,
                'Total Required': total_required,
                'Overall Compliance %': overall_pct,
                'Status': 'Compliant' if is_compliant else 'Non-Compliant'
            })
            
        conn.close()
        return pd.DataFrame(results)


class TCMSApp(ctk.CTk):
    """Main Application GUI View Controller."""
    def __init__(self):
        super().__init__()
        self.title("Training Compliance Management System (TCMS)")
        self.geometry("1100x680")
        
        # Initialize databases
        init_database()
        
        # App layout grids
        self.grid_rowconfigure(0, weight=1)
        self.grid_columnconfigure(1, weight=1)
        
        # Left Rail Navigation
        self.nav_frame = ctk.CTkFrame(self, width=200, corner_radius=0)
        self.nav_frame.grid(row=0, column=0, sticky="nsew")
        
        self.logo_label = ctk.CTkLabel(self.nav_frame, text="TCMS Portal", font=ctk.CTkFont(size=20, weight="bold"))
        self.logo_label.pack(pady=20, padx=10)
        
        self.btn_dash = ctk.CTkButton(self.nav_frame, text="Dashboard", command=self.show_dashboard_tab)
        self.btn_dash.pack(pady=10, padx=15, fill="x")
        
        self.btn_emp = ctk.CTkButton(self.nav_frame, text="Employee Browser", command=self.show_employee_tab)
        self.btn_emp.pack(pady=10, padx=15, fill="x")
        
        self.btn_policy = ctk.CTkButton(self.nav_frame, text="Completion Policy", command=self.show_policy_tab)
        self.btn_policy.pack(pady=10, padx=15, fill="x")
        
        self.btn_import = ctk.CTkButton(self.nav_frame, text="Import Central", command=self.show_import_tab)
        self.btn_import.pack(pady=10, padx=15, fill="x")
        
        # Main Work Stage
        self.main_frame = ctk.CTkFrame(self, corner_radius=0)
        self.main_frame.grid(row=0, column=1, sticky="nsew", padx=10, pady=10)
        self.main_frame.grid_rowconfigure(0, weight=1)
        self.main_frame.grid_columnconfigure(0, weight=1)
        
        # Tab Subframes
        self.tabs = {}
        self.init_all_tabs()
        
        self.show_dashboard_tab()

    def init_all_tabs(self):
        # 1. Dashboard Tab
        self.tabs['dash'] = ctk.CTkFrame(self.main_frame)
        lbl = ctk.CTkLabel(self.tabs['dash'], text="Executive Training Analytics", font=ctk.CTkFont(size=18, weight="bold"))
        lbl.pack(pady=10)
        
        # Graph Canvas zone
        self.fig_canvas_frame = ctk.CTkFrame(self.tabs['dash'])
        self.fig_canvas_frame.pack(fill="both", expand=True, padx=15, pady=15)

        # 2. Employee Tab
        self.tabs['emp'] = ctk.CTkFrame(self.main_frame)
        self.init_employee_tab_ui()

        # 3. Policy Tab
        self.tabs['policy'] = ctk.CTkFrame(self.main_frame)
        self.init_policy_tab_ui()

        # 4. Import Tab
        self.tabs['import'] = ctk.CTkFrame(self.main_frame)
        self.init_import_tab_ui()

    def show_tab(self, tab_key):
        for frame in self.tabs.values():
            frame.grid_forget()
        self.tabs[tab_key].grid(row=0, column=0, sticky="nsew")

    def show_dashboard_tab(self):
        self.show_tab('dash')
        self.render_dashboard_charts()

    def show_employee_tab(self):
        self.show_tab('emp')
        self.refresh_employee_table()

    def show_policy_tab(self):
        self.show_tab('policy')
        self.load_policy_inputs()

    def show_import_tab(self):
        self.show_tab('import')

    # Employee Tab UI
    def init_employee_tab_ui(self):
        top_bar = ctk.CTkFrame(self.tabs['emp'])
        top_bar.pack(fill="x", padx=10, pady=10)
        
        lbl_search = ctk.CTkLabel(top_bar, text="Search Employee:")
        lbl_search.pack(side="left", padx=5)
        
        self.ent_search = ctk.CTkEntry(top_bar, width=200)
        self.ent_search.pack(side="left", padx=5)
        self.ent_search.bind("<KeyRelease>", lambda e: self.refresh_employee_table())
        
        # Table Scroll Frame
        tbl_frame = ctk.CTkFrame(self.tabs['emp'])
        tbl_frame.pack(fill="both", expand=True, padx=10, pady=10)
        
        self.tree = ttk.Treeview(tbl_frame, columns=("Name", "ID", "Vertical", "Overall %", "Status"), show="headings")
        self.tree.heading("Name", text="Name")
        self.tree.heading("ID", text="Service No")
        self.tree.heading("Vertical", text="Vertical")
        self.tree.heading("Overall %", text="Overall Compliance")
        self.tree.heading("Status", text="Status")
        
        self.tree.pack(fill="both", expand=True, side="left")
        
        sb = ttk.Scrollbar(tbl_frame, orient="vertical", command=self.tree.yview)
        self.tree.configure(yscrollcommand=sb.set)
        sb.pack(fill="y", side="right")
        
        self.tree.bind("<Double-1>", self.on_employee_double_click)

    def refresh_employee_table(self):
        for item in self.tree.get_children():
            self.tree.delete(item)
            
        try:
            df = TCMSModel.calculate_compliance_report()
            if df.empty:
                return
                
            search_val = self.ent_search.get().lower()
            for _, row in df.iterrows():
                name = str(row['Employee Name'])
                sno = str(row['Service No'])
                vertical = str(row['Vertical'])
                pct = f"{row['Overall Compliance %']:.1f}%"
                status = row['Status']
                
                if search_val in name.lower() or search_val in sno.lower():
                    self.tree.insert("", "end", values=(name, sno, vertical, pct, status))
        except Exception as e:
            logging.error(f"Error loading table: {e}")

    def on_employee_double_click(self, event):
        item_id = self.tree.focus()
        if not item_id:
            return
        row_vals = self.tree.item(item_id, 'values')
        service_no = row_vals[1]
        
        # Launch overrides/history detail modal popup
        self.open_employee_detail_dialog(service_no)

    def open_employee_detail_dialog(self, service_no):
        dialog = ctk.CTkToplevel(self)
        dialog.title(f"Audit Card: {service_no}")
        dialog.geometry("450x380")
        dialog.grab_set()
        
        lbl_title = ctk.CTkLabel(dialog, text=f"Employee Service Log - {service_no}", font=ctk.CTkFont(size=14, weight="bold"))
        lbl_title.pack(pady=10)
        
        # Override Count Widget
        over_frame = ctk.CTkFrame(dialog)
        over_frame.pack(fill="x", padx=15, pady=10)
        
        lbl_over = ctk.CTkLabel(over_frame, text="Manual Override Category A Completions:")
        lbl_over.pack(pady=5)
        
        ent_count = ctk.CTkEntry(over_frame, width=80)
        ent_count.pack(pady=5)
        
        # Prepopulate existing Category A count
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute("SELECT completed_count FROM category_a_data WHERE service_no = ?", (service_no,))
        res = cursor.fetchone()
        conn.close()
        
        val = res[0] if res else 0
        ent_count.insert(0, str(val))
        
        def save_override():
            try:
                c = int(ent_count.get())
                TCMSModel.save_category_a_override(service_no, c, source='manual')
                messagebox.showinfo("Success", "Category A Manual Override Saved Successfully.")
                dialog.destroy()
                self.refresh_employee_table()
            except Exception as ex:
                messagebox.showerror("Error", f"Failed: {ex}")
                
        btn_save = ctk.CTkButton(over_frame, text="Commit Override Tally", command=save_override)
        btn_save.pack(pady=10)

    # Policy Editor UI
    def init_policy_tab_ui(self):
        lbl = ctk.CTkLabel(self.tabs['policy'], text="Compliance Policy Guidelines", font=ctk.CTkFont(size=16, weight="bold"))
        lbl.pack(pady=20)
        
        self.policy_inputs = {}
        fields = ['Fundamental', 'Category A', 'Category B', 'Category C', 'Category D']
        
        for field in fields:
            frm = ctk.CTkFrame(self.tabs['policy'])
            frm.pack(fill="x", padx=40, pady=5)
            
            lbl_field = ctk.CTkLabel(frm, text=f"Required completions in {field}:", width=250, anchor="w")
            lbl_field.pack(side="left", padx=10, pady=5)
            
            ent = ctk.CTkEntry(frm, width=80)
            ent.pack(side="right", padx=10, pady=5)
            self.policy_inputs[field] = ent
            
        btn_save = ctk.CTkButton(self.tabs['policy'], text="Apply Guidelines", command=self.save_policy)
        btn_save.pack(pady=20)

    def load_policy_inputs(self):
        policy = TCMSModel.get_policy()
        for field, ent in self.policy_inputs.items():
            ent.delete(0, "end")
            ent.insert(0, str(policy.get(field, 0)))

    def save_policy(self):
        try:
            policy_dict = {f: int(self.policy_inputs[f].get()) for f in self.policy_inputs}
            TCMSModel.update_policy(policy_dict)
            messagebox.showinfo("Success", "Compliance policy successfully updated.")
            self.refresh_employee_table()
        except Exception as ex:
            messagebox.showerror("Error", f"Could not save guidelines: {ex}")

    # Import UI
    def init_import_tab_ui(self):
        lbl = ctk.CTkLabel(self.tabs['import'], text="Bulk Import Desk", font=ctk.CTkFont(size=16, weight="bold"))
        lbl.pack(pady=20)
        
        btn_imp_train = ctk.CTkButton(self.tabs['import'], text="Import Training Registers Excel", command=self.import_training_files)
        btn_imp_train.pack(pady=15, padx=30, fill="x")
        
        btn_imp_cata = ctk.CTkButton(self.tabs['import'], text="Import Category A Register Excel", command=self.import_category_a_files)
        btn_imp_cata.pack(pady=15, padx=30, fill="x")

    def import_training_files(self):
        path = filedialog.askopenfilename(filetypes=[("Excel Files", "*.xlsx;*.xls")])
        if not path:
            return
        try:
            count, _ = TCMSModel.import_training_excel(path)
            messagebox.showinfo("Success", f"Successfully loaded {count} training records to the SQLite database.")
        except Exception as ex:
            messagebox.showerror("Error", f"Failed to load file: {ex}")

    def import_category_a_files(self):
        path = filedialog.askopenfilename(filetypes=[("Excel Files", "*.xlsx;*.xls")])
        if not path:
            return
        try:
            count = TCMSModel.import_category_a_excel(path)
            messagebox.showinfo("Success", f"Category A registers loaded for {count} employees.")
        except Exception as ex:
            messagebox.showerror("Error", f"Import failed: {ex}")

    # Charts Dashboard compiler
    def render_dashboard_charts(self):
        for widget in self.fig_canvas_frame.winfo_children():
            widget.destroy()
            
        try:
            df = TCMSModel.calculate_compliance_report()
            if df.empty:
                lbl = ctk.CTkLabel(self.fig_canvas_frame, text="No data present in the database. Load files via Import Central.")
                lbl.pack(pady=40)
                return
                
            # Vertical wise compliance aggregation
            vert_agg = df.groupby('Vertical')['Overall Compliance %'].mean().reset_index()
            
            fig, ax = plt.subplots(figsize=(6, 3), dpi=100)
            fig.patch.set_facecolor('#F8FAFC')
            ax.set_facecolor('#F8FAFC')
            
            colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
            ax.bar(vert_agg['Vertical'], vert_agg['Overall Compliance %'], color=colors[:len(vert_agg)], width=0.45)
            ax.set_title("Average Compliance Rates Across Corporate Verticals", fontsize=10, fontweight="bold", pad=12)
            ax.set_ylim(0, 100)
            ax.tick_params(labelsize=8)
            ax.spines['top'].set_visible(False)
            ax.spines['right'].set_visible(False)
            ax.spines['left'].set_color('#CBD5E1')
            ax.spines['bottom'].set_color('#CBD5E1')
            
            plt.tight_layout()
            
            canvas = FigureCanvasTkAgg(fig, master=self.fig_canvas_frame)
            canvas.draw()
            canvas.get_tk_widget().pack(fill="both", expand=True)
        except Exception as ex:
            logging.error(f"Failed to compile dashboard: {ex}")


if __name__ == "__main__":
    app = TCMSApp()
    app.mainloop()
