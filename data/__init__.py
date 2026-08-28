"""
data package initialization
"""
import os

# Extend path to include backend/data package modules
backend_data_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../backend/data"))
if os.path.exists(backend_data_path) and backend_data_path not in __path__:
    __path__.append(backend_data_path)
