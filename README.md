# Garage CRM - Workshop Management System

A specialized digital solution for modern automotive workshops to manage the entire vehicle service lifecycle, from admission to final billing.

## 📌 Project Overview

The Garage CRM is designed to streamline day-to-day operations for garage owners. It replaces manual paperwork with a structured digital workflow, ensuring that every vehicle's service history, costs, and customer interactions are accurately recorded and easily accessible.

## 🛠 Core Features (Garage Side)

### 1. Vehicle Admission & Job Cards
*   **Digital Job Cards:** Generate unique tracking IDs for every incoming vehicle.
*   **Visual Inspections:** Capture and store vehicle photos at the time of entry to maintain a record of the vehicle's condition.
*   **Service Tracking:** Log specific customer complaints, requested services, and current odometer (KM) readings.
*   **Status History:** Automatically track the lifecycle of a job (Pending, In Progress, Ready, etc.) with a timestamped history.

### 2. Customer & Vehicle Management
*   **Centralized Records:** Maintain a database of customers and their contact information.
*   **Vehicle Linking:** Link multiple vehicles to a single customer, building a comprehensive service history over time.

### 3. Smart Quotation Engine
*   **Detailed Estimation:** Add parts and services with individual pricing and quantities.
*   **Automated Math:** The system calculates subtotals, applies discounts, computes taxes, and provides a final grand total.
*   **Approval Workflow:** Track whether a quotation is pending or has been approved by the customer.

### 4. Professional Invoicing
*   **Seamless Conversion:** Convert approved quotations or completed job cards into professional invoices with one click.
*   **Payment Status:** Track total amounts, payments made, and outstanding balances.
*   **Sequential Numbering:** Ensures all financial records follow a professional, unique numbering system.

## 🔄 Technical Workflow (Lifecycle of a Vehicle)

The system is built around a logical flow that mirrors a real-world garage operation:

1.  **Admission:** A customer arrives. Staff searches for the customer or creates a new profile and records the vehicle details.
2.  **Job Card:** A digital Job Card is opened. Odometer readings and status photos are uploaded.
3.  **Estimation:** The garage creates a **Quotation** listing the estimated parts and labor.
4.  **Work Execution:** As technicians work, the Job Card **Status** is updated. Each update is logged in the `statusHistory` for transparency.
5.  **Billing:** Once the vehicle is ready, the system generates an **Invoice** based on the final work performed.
6.  **Checkout:** Payment is recorded, the invoice is closed, and the vehicle is delivered back to the customer.

--- 
*Created to digitize and professionalize automotive service management.*
