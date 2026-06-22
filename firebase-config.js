// ============================================================
// NEXUS ERP — Firebase Configuration
// Replace the values below with your actual Firebase project config
// from https://console.firebase.google.com → Project Settings → Your Apps
// ============================================================

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// ============================================================
// FIRESTORE SECURITY RULES (paste in Firebase Console → Firestore → Rules)
// ============================================================
/*
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isAuth() { return request.auth != null; }
    function getRole() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;
    }
    function isSuperAdmin() { return getRole() == 'superadmin'; }
    function isAdmin()      { return getRole() in ['admin','superadmin']; }
    function isWorker()     { return getRole() in ['worker','admin','superadmin']; }

    match /users/{uid} {
      allow read: if isAuth() && (request.auth.uid == uid || isAdmin());
      allow write: if isSuperAdmin();
    }
    match /stocks/{id} {
      allow read: if isWorker();
      allow write: if isAdmin();
    }
    match /transactions/{id} {
      allow read: if isWorker();
      allow create: if isWorker();
      allow update, delete: if isAdmin();
    }
    match /payroll/{id} {
      allow read, write: if isAdmin();
    }
    match /quotations/{id} {
      allow read: if isWorker();
      allow create: if isWorker();
      allow update, delete: if isAdmin();
    }
  }
}
*/

// ============================================================
// C# BACKEND REFERENCE (ASP.NET Core Web API)
// Save as: NexusERP.API/Controllers/PayrollController.cs
// ============================================================
/*
using Microsoft.AspNetCore.Mvc;
using Google.Cloud.Firestore;

namespace NexusERP.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PayrollController : ControllerBase
    {
        private readonly FirestoreDb _db;
        public PayrollController()
        {
            _db = FirestoreDb.Create("YOUR_PROJECT_ID");
        }

        // POST api/payroll/compute
        [HttpPost("compute")]
        public async Task<IActionResult> ComputePayroll([FromBody] PayrollRequest req)
        {
            double gross = req.BasicPay + req.Overtime + req.Allowances;

            // Philippine mandatory deductions (2024 rates)
            double sss = ComputeSSS(gross);
            double pagibig = Math.Min(gross * 0.02, 100);   // max PHP 100
            double philhealth = gross * 0.05 / 2;            // employee share 2.5%
            double withholdingTax = ComputeWithholdingTax(gross);

            double totalDeductions = sss + pagibig + philhealth + withholdingTax + req.OtherDeductions;
            double netPay = gross - totalDeductions;

            var payroll = new Dictionary<string, object> {
                { "employeeId", req.EmployeeId },
                { "period", req.Period },
                { "grossPay", gross },
                { "sss", sss },
                { "pagibig", pagibig },
                { "philhealth", philhealth },
                { "withholdingTax", withholdingTax },
                { "otherDeductions", req.OtherDeductions },
                { "netPay", netPay },
                { "status", "pending" },
                { "createdAt", Timestamp.GetCurrentTimestamp() }
            };

            await _db.Collection("payroll").AddAsync(payroll);
            return Ok(new { netPay, totalDeductions, sss, pagibig, philhealth, withholdingTax });
        }

        private double ComputeSSS(double gross)
        {
            // SSS contribution table (simplified bracket)
            if (gross < 4250) return 180;
            if (gross < 4750) return 202.50;
            if (gross < 5250) return 225;
            // ... extend with full bracket table
            if (gross >= 29750) return 1350;
            return Math.Round(gross * 0.045, 2);
        }

        private double ComputeWithholdingTax(double monthly)
        {
            // TRAIN Law tax table (monthly)
            if (monthly <= 20833) return 0;
            if (monthly <= 33332) return (monthly - 20833) * 0.20;
            if (monthly <= 66666) return 2500 + (monthly - 33333) * 0.25;
            if (monthly <= 166666) return 10833 + (monthly - 66667) * 0.30;
            if (monthly <= 666666) return 40833.33 + (monthly - 166667) * 0.32;
            return 200833.33 + (monthly - 666667) * 0.35;
        }
    }

    public class PayrollRequest
    {
        public string EmployeeId { get; set; }
        public string Period { get; set; }
        public double BasicPay { get; set; }
        public double Overtime { get; set; }
        public double Allowances { get; set; }
        public double OtherDeductions { get; set; }
    }
}
*/
