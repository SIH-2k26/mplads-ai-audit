// ─── Complete UI translation strings ─────────────────────────────────────────
// Keys are structured by feature area. All languages have 100% identical keys.

export const translations = {
  "en": {
    "brand": "sanchay",
    "tagline": "MPLADS Forensic Auditing & Risk Intelligence",
    "header": {
      "context": "Context",
      "role": "Role",
      "askAgastya": "Ask Agastya"
    },
    "roles": {
      "MP": "MP (Lok Sabha)",
      "DISTRICT_AUTHORITY": "District Collector",
      "STATE_NODAL": "State Nodal",
      "MINISTRY_DIID": "Ministry / MoSPI",
      "AUDITOR": "CAG Auditor"
    },
    "nav": {
      "myConstituency": "My Constituency",
      "districtCommand": "District Command",
      "stateCommand": "State Command",
      "nationalCommand": "National Command",
      "auditOperations": "Audit Operations",
      "forensicsWatch": "Forensics & Watch",
      "forensicInvestigation": "Forensic Investigation",
      "financialsRisk": "Financials & Risk",
      "enforcement": "Enforcement & Risk",
      "intelligenceRisk": "Intelligence & Risk",
      "governance": "Governance",
      "policyGovernance": "Policy & Governance",
      "registries": "Registries",
      "reports": "Reports",
      "mpOverview": "MP Overview",
      "districtOverview": "District Overview",
      "stateOverview": "State Overview",
      "districtBreakdown": "District Breakdown",
      "ministryCommand": "Ministry Command",
      "stateTelemetry": "State Telemetry",
      "projectsExplorer": "Projects Explorer",
      "constituencyMap": "Constituency Map",
      "nationalMap": "National Map",
      "alertsWarnings": "Alerts & Warnings",
      "nationalAlerts": "National Alerts",
      "alertsFlags": "Alerts & Flags",
      "casesDirectorate": "Cases Directorate",
      "riskAssessment": "Risk Assessment",
      "riskSimulator": "Risk Simulator",
      "complianceStatus": "Compliance Status",
      "complianceTracker": "Compliance Tracker",
      "statutoryCompliance": "Statutory Compliance",
      "contractors": "Contractors",
      "agenciesOffice": "Agencies Office",
      "policiesRegistry": "Policies Registry",
      "auditReports": "Audit Reports",
      "nationalReports": "National Reports"
    },
    "sidebarFooter": "MPLADS Guardian v3.0",
    "roleBadge": {
      "MP": "MP VIEW",
      "DISTRICT_AUTHORITY": "District VIEW",
      "STATE_NODAL": "State Nodal VIEW",
      "MINISTRY_DIID": "Ministry VIEW",
      "AUDITOR": "CAG Auditor VIEW"
    },
    "district": {
      "title": "DISTRICT COMMAND DASHBOARD",
      "subtitle": "Vigilance metrics & localized project delays",
      "cards": {
        "works": "District Works",
        "worksDesc": "Total monitored works in district",
        "sanctioned": "Total Sanctioned",
        "sanctionedDesc": "Approved allocations",
        "expenditure": "Expenditure",
        "expenditureDesc": "Reconciled spending",
        "criticalOverlaps": "Critical Overlaps",
        "criticalOverlapsDesc": "Works with risk score ≥ 80"
      },
      "charts": {
        "statusDistribution": "Works Status Distribution",
        "riskMatrix": "Risk Matrix Status Panel",
        "lowRisk": "Low Risk Works",
        "atRisk": "At-Risk Works"
      },
      "table": {
        "title": "Works Under Inspection",
        "code": "Code",
        "project": "Project Title",
        "sanctioned": "Sanctioned Amount",
        "physical": "Physical Progress",
        "risk": "Risk Score",
        "status": "Status",
        "actions": "Actions",
        "inspect": "Inspect Digital Twin",
        "loading": "Loading portfolio...",
        "noResults": "No works found for",
        "district": "district."
      }
    },
    "mp": {
      "title": "MP CONSTITUENCY TELEMETRY",
      "subtitle": "Constituency Financial & Physical Development Tracker",
      "cards": {
        "sanctioned": "Sanctioned Fund Allocation",
        "expenditure": "Expenditure Incurred",
        "activeWorks": "Active Works"
      },
      "table": {
        "title": "Constituency Civil Projects Portfolio",
        "code": "Code",
        "project": "Project Title",
        "sanctioned": "Sanctioned Amount",
        "physical": "Physical Progress",
        "financial": "Financial Progress",
        "actions": "Actions",
        "inspect": "Inspect Digital Twin",
        "loading": "Loading portfolio..."
      }
    },
    "ministry": {
      "title": "NATIONAL AUDIT TELEMETRY",
      "subtitle": "Ministry of Statistics & Programme Implementation (MoSPI) Command Centre",
      "cards": {
        "totalWorks": "Total Monitored Works",
        "totalWorksDesc": "Projects under supervision",
        "utilisation": "Utilisation Ratio",
        "critical": "Critical Risk Anomaly Flags",
        "criticalDesc": "Risk score ≥ 80",
        "totalFunds": "Total Sanctioned Funds",
        "totalFundsDesc": "Aggregate allocations"
      },
      "charts": {
        "stateOutlay": "State-wise Sanctioned Outlay (₹ Crores)"
      },
      "table": {
        "title": "State-wise Telemetry Breakdown",
        "state": "State Nodal Office",
        "totalWorks": "Total Works",
        "sanctioned": "Sanctioned Amount",
        "utilisation": "Utilisation %",
        "critical": "Critical Anomalies",
        "status": "Oversight Status",
        "activeMonitoring": "ACTIVE MONITORING"
      }
    },
    "projects": {
      "title": "FORENSIC PROJECTS EXPLORER",
      "subtitle": "Search and verify civil works, physical milestone updates, and transaction anomalies",
      "filter": {
        "search": "Search code, title, contractor...",
        "category": "All Categories",
        "status": "All Statuses",
        "risk": "All Risk Levels",
        "clear": "Clear Filters"
      },
      "table": {
        "title": "Civil Works Portfolio",
        "code": "Code",
        "project": "Project Title",
        "category": "Category",
        "sanctioned": "Sanctioned Amount",
        "physical": "Physical Progress",
        "risk": "Risk Score",
        "actions": "Actions",
        "inspectTwin": "Inspect Twin",
        "loading": "Querying project registries...",
        "noResults": "No projects match current filters."
      }
    },
    "alerts": {
      "title": "CRITICAL RISK ANOMALY FLAGS",
      "subtitle": "Real-time optical divergence, clustered contractor bidding, and SLA breaches",
      "whyFlagged": "Why Flagged",
      "ruleApplicability": "Rule Applicability",
      "slaDeadline": "SLA Deadline",
      "daysRemaining": "days remaining",
      "acknowledge": "Acknowledge",
      "resolveHold": "Enforce Hold / Resolve",
      "actionLogged": "Action Logged Successfully",
      "inspectTwin": "Inspect Twin Cockpit"
    },
    "riskAssessment": {
      "title": "RISK ASSESSMENT FORENSIC SIMULATOR",
      "subtitle": "Simulate tender bids deviation, progress mismatch triggers, and documentation deficit scores",
      "presets": "Simulation Presets",
      "configurator": "Forensic Variable Configurator",
      "identification": "Project Identification",
      "financials": "Financials & Performance",
      "tendering": "Tendering & Statutory Compliance",
      "reset": "Reset Configuration",
      "simulate": "Simulate Risk Profile",
      "saveLog": "Save Simulation Log",
      "modifyInputs": "Modify Inputs",
      "processing": "Forensic Neural Simulation Active"
    },
    "common": {
      "loading": "Loading...",
      "backToExplorer": "Back to Projects Explorer",
      "backToDirectorate": "Back to Directorate",
      "home": "Home",
      "noData": "No data available.",
      "openDossier": "Open Evidence Dossier",
      "printBrief": "Print Cockpit Brief",
      "riskScore": "Risk Score",
      "sanctionedAmount": "Sanctioned Amount",
      "physicalProgress": "Physical Progress",
      "financialProgress": "Financial Progress",
      "contractor": "Contractor",
      "district": "District",
      "state": "State"
    }
  },
  "hi": {
    "brand": "sanchay",
    "tagline": "एमपीलैड्स न्यायिक लेखापरीक्षण और जोखिम खुफिया",
    "header": {
      "context": "संदर्भ",
      "role": "भूमिका",
      "askAgastya": "अगस्त्या को पूछें"
    },
    "roles": {
      "MP": "सांसद (लोक सभा)",
      "DISTRICT_AUTHORITY": "जिला कलेक्टर",
      "STATE_NODAL": "राज्य नोडल",
      "MINISTRY_DIID": "मंत्रालय / मोसपी",
      "AUDITOR": "सीएजी लेखापरीक्षक"
    },
    "nav": {
      "myConstituency": "मेरा निर्वाचन क्षेत्र",
      "districtCommand": "जिला कमांड",
      "stateCommand": "राज्य कमांड",
      "nationalCommand": "राष्ट्रीय कमांड",
      "auditOperations": "लेखापरीक्षण कार्य",
      "forensicsWatch": "न्यायिक और निगरानी",
      "forensicInvestigation": "न्यायिक जांच",
      "financialsRisk": "वित्त और जोखिम",
      "enforcement": "प्रवर्तन और जोखिम",
      "intelligenceRisk": "खुफिया और जोखिम",
      "governance": "शासन",
      "policyGovernance": "नीति और शासन",
      "registries": "रजिस्ट्री",
      "reports": "रिपोर्ट",
      "mpOverview": "सांसद अवलोकन",
      "districtOverview": "जिला अवलोकन",
      "stateOverview": "राज्य अवलोकन",
      "districtBreakdown": "जिला विश्लेषण",
      "ministryCommand": "मंत्रालय कमांड",
      "stateTelemetry": "राज्य टेलीमेट्री",
      "projectsExplorer": "परियोजना खोज",
      "constituencyMap": "निर्वाचन क्षेत्र मानचित्र",
      "nationalMap": "राष्ट्रीय मानचित्र",
      "alertsWarnings": "अलर्ट और चेतावनियां",
      "nationalAlerts": "राष्ट्रीय अलर्ट",
      "alertsFlags": "अलर्ट और ध्वज",
      "casesDirectorate": "मामले निदेशालय",
      "riskAssessment": "जोखिम मूल्यांकन",
      "riskSimulator": "जोखिम सिम्युलेटर",
      "complianceStatus": "अनुपालन स्थिति",
      "complianceTracker": "अनुपालन ट्रैकर",
      "statutoryCompliance": "वैधानिक अनुपालन",
      "contractors": "ठेकेदार",
      "agenciesOffice": "एजेंसी कार्यालय",
      "policiesRegistry": "नीति रजिस्ट्री",
      "auditReports": "लेखापरीक्षण रिपोर्ट",
      "nationalReports": "राष्ट्रीय रिपोर्ट"
    },
    "sidebarFooter": "MPLADS Guardian v3.0",
    "roleBadge": {
      "MP": "सांसद दृश्य",
      "DISTRICT_AUTHORITY": "जिला दृश्य",
      "STATE_NODAL": "राज्य नोडल दृश्य",
      "MINISTRY_DIID": "मंत्रालय दृश्य",
      "AUDITOR": "सीएजी दृश्य"
    },
    "district": {
      "title": "DISTRICT COMMAND DASHBOARD",
      "subtitle": "Vigilance metrics & localized project delays",
      "cards": {
        "works": "District Works",
        "worksDesc": "Total monitored works in district",
        "sanctioned": "Total Sanctioned",
        "sanctionedDesc": "Approved allocations",
        "expenditure": "Expenditure",
        "expenditureDesc": "Reconciled spending",
        "criticalOverlaps": "Critical Overlaps",
        "criticalOverlapsDesc": "Works with risk score ≥ 80"
      },
      "charts": {
        "statusDistribution": "Works Status Distribution",
        "riskMatrix": "Risk Matrix Status Panel",
        "lowRisk": "Low Risk Works",
        "atRisk": "At-Risk Works"
      },
      "table": {
        "title": "Works Under Inspection",
        "code": "Code",
        "project": "Project Title",
        "sanctioned": "Sanctioned Amount",
        "physical": "Physical Progress",
        "risk": "Risk Score",
        "status": "Status",
        "actions": "Actions",
        "inspect": "Inspect Digital Twin",
        "loading": "Loading portfolio...",
        "noResults": "No works found for",
        "district": "district."
      }
    },
    "mp": {
      "title": "MP CONSTITUENCY TELEMETRY",
      "subtitle": "Constituency Financial & Physical Development Tracker",
      "cards": {
        "sanctioned": "Sanctioned Fund Allocation",
        "expenditure": "Expenditure Incurred",
        "activeWorks": "Active Works"
      },
      "table": {
        "title": "Constituency Civil Projects Portfolio",
        "code": "Code",
        "project": "Project Title",
        "sanctioned": "Sanctioned Amount",
        "physical": "Physical Progress",
        "financial": "Financial Progress",
        "actions": "Actions",
        "inspect": "Inspect Digital Twin",
        "loading": "Loading portfolio..."
      }
    },
    "ministry": {
      "title": "NATIONAL AUDIT TELEMETRY",
      "subtitle": "Ministry of Statistics & Programme Implementation (MoSPI) Command Centre",
      "cards": {
        "totalWorks": "Total Monitored Works",
        "totalWorksDesc": "Projects under supervision",
        "utilisation": "Utilisation Ratio",
        "critical": "Critical Risk Anomaly Flags",
        "criticalDesc": "Risk score ≥ 80",
        "totalFunds": "Total Sanctioned Funds",
        "totalFundsDesc": "Aggregate allocations"
      },
      "charts": {
        "stateOutlay": "State-wise Sanctioned Outlay (₹ Crores)"
      },
      "table": {
        "title": "State-wise Telemetry Breakdown",
        "state": "State Nodal Office",
        "totalWorks": "Total Works",
        "sanctioned": "Sanctioned Amount",
        "utilisation": "Utilisation %",
        "critical": "Critical Anomalies",
        "status": "Oversight Status",
        "activeMonitoring": "ACTIVE MONITORING"
      }
    },
    "projects": {
      "title": "FORENSIC PROJECTS EXPLORER",
      "subtitle": "Search and verify civil works, physical milestone updates, and transaction anomalies",
      "filter": {
        "search": "Search code, title, contractor...",
        "category": "All Categories",
        "status": "All Statuses",
        "risk": "All Risk Levels",
        "clear": "Clear Filters"
      },
      "table": {
        "title": "Civil Works Portfolio",
        "code": "Code",
        "project": "Project Title",
        "category": "Category",
        "sanctioned": "Sanctioned Amount",
        "physical": "Physical Progress",
        "risk": "Risk Score",
        "actions": "Actions",
        "inspectTwin": "Inspect Twin",
        "loading": "Querying project registries...",
        "noResults": "No projects match current filters."
      }
    },
    "alerts": {
      "title": "CRITICAL RISK ANOMALY FLAGS",
      "subtitle": "Real-time optical divergence, clustered contractor bidding, and SLA breaches",
      "whyFlagged": "Why Flagged",
      "ruleApplicability": "Rule Applicability",
      "slaDeadline": "SLA Deadline",
      "daysRemaining": "days remaining",
      "acknowledge": "Acknowledge",
      "resolveHold": "Enforce Hold / Resolve",
      "actionLogged": "Action Logged Successfully",
      "inspectTwin": "Inspect Twin Cockpit"
    },
    "riskAssessment": {
      "title": "RISK ASSESSMENT FORENSIC SIMULATOR",
      "subtitle": "Simulate tender bids deviation, progress mismatch triggers, and documentation deficit scores",
      "presets": "Simulation Presets",
      "configurator": "Forensic Variable Configurator",
      "identification": "Project Identification",
      "financials": "Financials & Performance",
      "tendering": "Tendering & Statutory Compliance",
      "reset": "Reset Configuration",
      "simulate": "Simulate Risk Profile",
      "saveLog": "Save Simulation Log",
      "modifyInputs": "Modify Inputs",
      "processing": "Forensic Neural Simulation Active"
    },
    "common": {
      "loading": "लोड हो रहा है...",
      "backToExplorer": "परियोजना खोज पर वापस जाएं",
      "backToDirectorate": "निदेशालय पर वापस जाएं",
      "home": "मुख्य पृष्ठ",
      "noData": "कोई डेटा उपलब्ध नहीं है",
      "openDossier": "साक्ष्य डोजियर खोलें",
      "printBrief": "संक्षिप्त विवरण प्रिंट करें",
      "riskScore": "जोखिम स्कोर",
      "sanctionedAmount": "मंजूर राशि",
      "physicalProgress": "भौतिक प्रगति",
      "financialProgress": "वित्तीय प्रगति",
      "contractor": "ठेकेदार",
      "district": "जिला",
      "state": "राज्य"
    }
  },
  "mr": {
    "brand": "sanchay",
    "tagline": "एमपीलैड्स न्यायवैद्यक लेखापरीक्षण आणि जोखीम बुद्धिमत्ता",
    "header": {
      "context": "संदर्भ",
      "role": "भूमिका",
      "askAgastya": "अगस्त्याला विचारा"
    },
    "roles": {
      "MP": "खासदार (लोकसभा)",
      "DISTRICT_AUTHORITY": "जिल्हाधिकारी",
      "STATE_NODAL": "राज्य नोडल",
      "MINISTRY_DIID": "मंत्रालय / मोसपी",
      "AUDITOR": "सीएजी लेखापरीक्षक"
    },
    "nav": {
      "myConstituency": "माझा मतदारसंघ",
      "districtCommand": "जिल्हा कमांड",
      "stateCommand": "राज्य कमांड",
      "nationalCommand": "राष्ट्रीय कमांड",
      "auditOperations": "लेखापरीक्षण कार्ये",
      "forensicsWatch": "न्यायवैद्यक आणि निगराणी",
      "forensicInvestigation": "न्यायवैद्यक तपास",
      "financialsRisk": "वित्त आणि जोखीम",
      "enforcement": "अंमलबजावणी आणि जोखीम",
      "intelligenceRisk": "गुप्तचर आणि जोखीम",
      "governance": "प्रशासन",
      "policyGovernance": "धोरण आणि प्रशासन",
      "registries": "नोंदणी",
      "reports": "अहवाल",
      "mpOverview": "खासदार आढावा",
      "districtOverview": "जिल्हा आढावा",
      "stateOverview": "राज्य आढावा",
      "districtBreakdown": "जिल्हा विश्लेषण",
      "ministryCommand": "मंत्रालय कमांड",
      "stateTelemetry": "राज्य टेलीमेट्री",
      "projectsExplorer": "प्रकल्प शोधकर्ता",
      "constituencyMap": "मतदारसंघ नकाशा",
      "nationalMap": "राष्ट्रीय नकाशा",
      "alertsWarnings": "सतर्कता आणि इशारे",
      "nationalAlerts": "राष्ट्रीय सतर्कता",
      "alertsFlags": "सतर्कता आणि ध्वज",
      "casesDirectorate": "प्रकरण संचालनालय",
      "riskAssessment": "जोखीम मूल्यांकन",
      "riskSimulator": "जोखीम सिम्युलेटर",
      "complianceStatus": "अनुपालन स्थिती",
      "complianceTracker": "अनुपालन ट्रॅकर",
      "statutoryCompliance": "वैधानिक अनुपालन",
      "contractors": "कंत्राटदार",
      "agenciesOffice": "एजन्सी कार्यालय",
      "policiesRegistry": "धोरण नोंदणी",
      "auditReports": "लेखापरीक्षण अहवाल",
      "nationalReports": "राष्ट्रीय अहवाल"
    },
    "sidebarFooter": "MPLADS Guardian v3.0",
    "roleBadge": {
      "MP": "खासदार दृश्य",
      "DISTRICT_AUTHORITY": "जिल्हा दृश्य",
      "STATE_NODAL": "राज्य नोडल दृश्य",
      "MINISTRY_DIID": "मंत्रालय दृश्य",
      "AUDITOR": "सीएजी दृश्य"
    },
    "district": {
      "title": "DISTRICT COMMAND DASHBOARD",
      "subtitle": "Vigilance metrics & localized project delays",
      "cards": {
        "works": "District Works",
        "worksDesc": "Total monitored works in district",
        "sanctioned": "Total Sanctioned",
        "sanctionedDesc": "Approved allocations",
        "expenditure": "Expenditure",
        "expenditureDesc": "Reconciled spending",
        "criticalOverlaps": "Critical Overlaps",
        "criticalOverlapsDesc": "Works with risk score ≥ 80"
      },
      "charts": {
        "statusDistribution": "Works Status Distribution",
        "riskMatrix": "Risk Matrix Status Panel",
        "lowRisk": "Low Risk Works",
        "atRisk": "At-Risk Works"
      },
      "table": {
        "title": "Works Under Inspection",
        "code": "Code",
        "project": "Project Title",
        "sanctioned": "Sanctioned Amount",
        "physical": "Physical Progress",
        "risk": "Risk Score",
        "status": "Status",
        "actions": "Actions",
        "inspect": "Inspect Digital Twin",
        "loading": "Loading portfolio...",
        "noResults": "No works found for",
        "district": "district."
      }
    },
    "mp": {
      "title": "MP CONSTITUENCY TELEMETRY",
      "subtitle": "Constituency Financial & Physical Development Tracker",
      "cards": {
        "sanctioned": "Sanctioned Fund Allocation",
        "expenditure": "Expenditure Incurred",
        "activeWorks": "Active Works"
      },
      "table": {
        "title": "Constituency Civil Projects Portfolio",
        "code": "Code",
        "project": "Project Title",
        "sanctioned": "Sanctioned Amount",
        "physical": "Physical Progress",
        "financial": "Financial Progress",
        "actions": "Actions",
        "inspect": "Inspect Digital Twin",
        "loading": "Loading portfolio..."
      }
    },
    "ministry": {
      "title": "NATIONAL AUDIT TELEMETRY",
      "subtitle": "Ministry of Statistics & Programme Implementation (MoSPI) Command Centre",
      "cards": {
        "totalWorks": "Total Monitored Works",
        "totalWorksDesc": "Projects under supervision",
        "utilisation": "Utilisation Ratio",
        "critical": "Critical Risk Anomaly Flags",
        "criticalDesc": "Risk score ≥ 80",
        "totalFunds": "Total Sanctioned Funds",
        "totalFundsDesc": "Aggregate allocations"
      },
      "charts": {
        "stateOutlay": "State-wise Sanctioned Outlay (₹ Crores)"
      },
      "table": {
        "title": "State-wise Telemetry Breakdown",
        "state": "State Nodal Office",
        "totalWorks": "Total Works",
        "sanctioned": "Sanctioned Amount",
        "utilisation": "Utilisation %",
        "critical": "Critical Anomalies",
        "status": "Oversight Status",
        "activeMonitoring": "ACTIVE MONITORING"
      }
    },
    "projects": {
      "title": "FORENSIC PROJECTS EXPLORER",
      "subtitle": "Search and verify civil works, physical milestone updates, and transaction anomalies",
      "filter": {
        "search": "Search code, title, contractor...",
        "category": "All Categories",
        "status": "All Statuses",
        "risk": "All Risk Levels",
        "clear": "Clear Filters"
      },
      "table": {
        "title": "Civil Works Portfolio",
        "code": "Code",
        "project": "Project Title",
        "category": "Category",
        "sanctioned": "Sanctioned Amount",
        "physical": "Physical Progress",
        "risk": "Risk Score",
        "actions": "Actions",
        "inspectTwin": "Inspect Twin",
        "loading": "Querying project registries...",
        "noResults": "No projects match current filters."
      }
    },
    "alerts": {
      "title": "CRITICAL RISK ANOMALY FLAGS",
      "subtitle": "Real-time optical divergence, clustered contractor bidding, and SLA breaches",
      "whyFlagged": "Why Flagged",
      "ruleApplicability": "Rule Applicability",
      "slaDeadline": "SLA Deadline",
      "daysRemaining": "days remaining",
      "acknowledge": "Acknowledge",
      "resolveHold": "Enforce Hold / Resolve",
      "actionLogged": "Action Logged Successfully",
      "inspectTwin": "Inspect Twin Cockpit"
    },
    "riskAssessment": {
      "title": "RISK ASSESSMENT FORENSIC SIMULATOR",
      "subtitle": "Simulate tender bids deviation, progress mismatch triggers, and documentation deficit scores",
      "presets": "Simulation Presets",
      "configurator": "Forensic Variable Configurator",
      "identification": "Project Identification",
      "financials": "Financials & Performance",
      "tendering": "Tendering & Statutory Compliance",
      "reset": "Reset Configuration",
      "simulate": "Simulate Risk Profile",
      "saveLog": "Save Simulation Log",
      "modifyInputs": "Modify Inputs",
      "processing": "Forensic Neural Simulation Active"
    },
    "common": {
      "loading": "लोड होत आहे...",
      "backToExplorer": "प्रकल्प शोधकर्त्याकडे परत",
      "backToDirectorate": "संचालनालयाकडे परत",
      "home": "मुखपृष्ठ",
      "noData": "कोणताही डेटा उपलब्ध नाही.",
      "openDossier": "पुरावा डोजियर उघडा",
      "printBrief": "कॉकपिट ब्रीफ प्रिंट",
      "riskScore": "जोखीम स्कोर",
      "sanctionedAmount": "मंजूर रक्कम",
      "physicalProgress": "भौतिक प्रगती",
      "financialProgress": "वित्तीय प्रगती",
      "contractor": "कंत्राटदार",
      "district": "जिल्हा",
      "state": "राज्य"
    }
  },
  "pa": {
    "brand": "sanchay",
    "tagline": "ਐਮ.ਪੀ.ਐਲ.ਏ.ਡੀ.ਐਸ. ਫੋਰੈਂਸਿਕ ਆਡਿਟਿੰਗ ਅਤੇ ਜੋਖਮ ਖੁਫੀਆ",
    "header": {
      "context": "ਸੰਦਰਭ",
      "role": "ਭੂਮਿਕਾ",
      "askAgastya": "ਅਗਸਤਿਆ ਤੋਂ ਪੁੱਛੋ"
    },
    "roles": {
      "MP": "ਐਮ.ਪੀ. (ਲੋਕ ਸਭਾ)",
      "DISTRICT_AUTHORITY": "ਜ਼ਿਲ੍ਹਾ ਕਲੈਕਟਰ",
      "STATE_NODAL": "ਰਾਜ ਨੋਡਲ",
      "MINISTRY_DIID": "ਮੰਤਰਾਲਾ / MoSPI",
      "AUDITOR": "ਸੀ.ਏ.ਜੀ. ਆਡੀਟਰ"
    },
    "nav": {
      "myConstituency": "ਮੇਰਾ ਹਲਕਾ",
      "districtCommand": "ਜ਼ਿਲ੍ਹਾ ਕਮਾਂਡ",
      "stateCommand": "ਰਾਜ ਕਮਾਂਡ",
      "nationalCommand": "ਰਾਸ਼ਟਰੀ ਕਮਾਂਡ",
      "auditOperations": "ਆਡਿਟ ਕਾਰਵਾਈਆਂ",
      "forensicsWatch": "ਫੋਰੈਂਸਿਕ ਅਤੇ ਨਿਗਰਾਨੀ",
      "forensicInvestigation": "ਫੋਰੈਂਸਿਕ ਜਾਂਚ",
      "financialsRisk": "ਵਿੱਤ ਅਤੇ ਜੋਖਮ",
      "enforcement": "ਲਾਗੂਕਰਨ ਅਤੇ ਜੋਖਮ",
      "intelligenceRisk": "ਖੁਫੀਆ ਅਤੇ ਜੋਖਮ",
      "governance": "ਸ਼ਾਸਨ",
      "policyGovernance": "ਨੀਤੀ ਅਤੇ ਸ਼ਾਸਨ",
      "registries": "ਰਜਿਸਟਰੀਆਂ",
      "reports": "ਰਿਪੋਰਟਾਂ",
      "mpOverview": "ਐਮ.ਪੀ. ਸਮੀਖਿਆ",
      "districtOverview": "ਜ਼ਿਲ੍ਹਾ ਸਮੀਖਿਆ",
      "stateOverview": "ਰਾਜ ਸਮੀਖਿਆ",
      "districtBreakdown": "ਜ਼ਿਲ੍ਹਾ ਵੇਰਵਾ",
      "ministryCommand": "ਮੰਤਰਾਲਾ ਕਮਾਂਡ",
      "stateTelemetry": "ਰਾਜ ਟੈਲੀਮੈਟਰੀ",
      "projectsExplorer": "ਪ੍ਰੋਜੈਕਟ ਐਕਸਪਲੋਰਰ",
      "constituencyMap": "ਹਲਕਾ ਨਕਸ਼ਾ",
      "nationalMap": "ਰਾਸ਼ਟਰੀ ਨਕਸ਼ਾ",
      "alertsWarnings": "ਚੇਤਾਵਨੀਆਂ",
      "nationalAlerts": "ਰਾਸ਼ਟਰੀ ਚੇਤਾਵਨੀਆਂ",
      "alertsFlags": "ਚੇਤਾਵਨੀ ਫਲੈਗ",
      "casesDirectorate": "ਕੇਸ ਨਿਰਦੇਸ਼ਾਲਯ",
      "riskAssessment": "ਜੋਖਮ ਮੁਲਾਂਕਣ",
      "riskSimulator": "ਜੋਖਮ ਸਿਮੂਲੇਟਰ",
      "complianceStatus": "ਅਨੁਪਾਲਨ ਸਥਿਤੀ",
      "complianceTracker": "ਅਨੁਪਾਲਨ ਟਰੈਕਰ",
      "statutoryCompliance": "ਕਾਨੂੰਨੀ ਅਨੁਪਾਲਨ",
      "contractors": "ਠੇਕੇਦਾਰ",
      "agenciesOffice": "ਏਜੰਸੀ ਦਫ਼ਤਰ",
      "policiesRegistry": "ਨੀਤੀ ਰਜਿਸਟਰੀ",
      "auditReports": "ਆਡਿਟ ਰਿਪੋਰਟਾਂ",
      "nationalReports": "ਰਾਸ਼ਟਰੀ ਰਿਪੋਰਟਾਂ"
    },
    "sidebarFooter": "MPLADS Guardian v3.0",
    "roleBadge": {
      "MP": "ਐਮ.ਪੀ. ਦ੍ਰਿਸ਼",
      "DISTRICT_AUTHORITY": "ਜ਼ਿਲ੍ਹਾ ਦ੍ਰਿਸ਼",
      "STATE_NODAL": "ਰਾਜ ਦ੍ਰਿਸ਼",
      "MINISTRY_DIID": "ਮੰਤਰਾਲਾ ਦ੍ਰਿਸ਼",
      "AUDITOR": "ਸੀ.ਏ.ਜੀ. ਦ੍ਰਿਸ਼"
    },
    "district": {
      "title": "DISTRICT COMMAND DASHBOARD",
      "subtitle": "Vigilance metrics & localized project delays",
      "cards": {
        "works": "District Works",
        "worksDesc": "Total monitored works in district",
        "sanctioned": "Total Sanctioned",
        "sanctionedDesc": "Approved allocations",
        "expenditure": "Expenditure",
        "expenditureDesc": "Reconciled spending",
        "criticalOverlaps": "Critical Overlaps",
        "criticalOverlapsDesc": "Works with risk score ≥ 80"
      },
      "charts": {
        "statusDistribution": "Works Status Distribution",
        "riskMatrix": "Risk Matrix Status Panel",
        "lowRisk": "Low Risk Works",
        "atRisk": "At-Risk Works"
      },
      "table": {
        "title": "Works Under Inspection",
        "code": "Code",
        "project": "Project Title",
        "sanctioned": "Sanctioned Amount",
        "physical": "Physical Progress",
        "risk": "Risk Score",
        "status": "Status",
        "actions": "Actions",
        "inspect": "Inspect Digital Twin",
        "loading": "Loading portfolio...",
        "noResults": "No works found for",
        "district": "district."
      }
    },
    "mp": {
      "title": "MP CONSTITUENCY TELEMETRY",
      "subtitle": "Constituency Financial & Physical Development Tracker",
      "cards": {
        "sanctioned": "Sanctioned Fund Allocation",
        "expenditure": "Expenditure Incurred",
        "activeWorks": "Active Works"
      },
      "table": {
        "title": "Constituency Civil Projects Portfolio",
        "code": "Code",
        "project": "Project Title",
        "sanctioned": "Sanctioned Amount",
        "physical": "Physical Progress",
        "financial": "Financial Progress",
        "actions": "Actions",
        "inspect": "Inspect Digital Twin",
        "loading": "Loading portfolio..."
      }
    },
    "ministry": {
      "title": "NATIONAL AUDIT TELEMETRY",
      "subtitle": "Ministry of Statistics & Programme Implementation (MoSPI) Command Centre",
      "cards": {
        "totalWorks": "Total Monitored Works",
        "totalWorksDesc": "Projects under supervision",
        "utilisation": "Utilisation Ratio",
        "critical": "Critical Risk Anomaly Flags",
        "criticalDesc": "Risk score ≥ 80",
        "totalFunds": "Total Sanctioned Funds",
        "totalFundsDesc": "Aggregate allocations"
      },
      "charts": {
        "stateOutlay": "State-wise Sanctioned Outlay (₹ Crores)"
      },
      "table": {
        "title": "State-wise Telemetry Breakdown",
        "state": "State Nodal Office",
        "totalWorks": "Total Works",
        "sanctioned": "Sanctioned Amount",
        "utilisation": "Utilisation %",
        "critical": "Critical Anomalies",
        "status": "Oversight Status",
        "activeMonitoring": "ACTIVE MONITORING"
      }
    },
    "projects": {
      "title": "FORENSIC PROJECTS EXPLORER",
      "subtitle": "Search and verify civil works, physical milestone updates, and transaction anomalies",
      "filter": {
        "search": "Search code, title, contractor...",
        "category": "All Categories",
        "status": "All Statuses",
        "risk": "All Risk Levels",
        "clear": "Clear Filters"
      },
      "table": {
        "title": "Civil Works Portfolio",
        "code": "Code",
        "project": "Project Title",
        "category": "Category",
        "sanctioned": "Sanctioned Amount",
        "physical": "Physical Progress",
        "risk": "Risk Score",
        "actions": "Actions",
        "inspectTwin": "Inspect Twin",
        "loading": "Querying project registries...",
        "noResults": "No projects match current filters."
      }
    },
    "alerts": {
      "title": "CRITICAL RISK ANOMALY FLAGS",
      "subtitle": "Real-time optical divergence, clustered contractor bidding, and SLA breaches",
      "whyFlagged": "Why Flagged",
      "ruleApplicability": "Rule Applicability",
      "slaDeadline": "SLA Deadline",
      "daysRemaining": "days remaining",
      "acknowledge": "Acknowledge",
      "resolveHold": "Enforce Hold / Resolve",
      "actionLogged": "Action Logged Successfully",
      "inspectTwin": "Inspect Twin Cockpit"
    },
    "riskAssessment": {
      "title": "RISK ASSESSMENT FORENSIC SIMULATOR",
      "subtitle": "Simulate tender bids deviation, progress mismatch triggers, and documentation deficit scores",
      "presets": "Simulation Presets",
      "configurator": "Forensic Variable Configurator",
      "identification": "Project Identification",
      "financials": "Financials & Performance",
      "tendering": "Tendering & Statutory Compliance",
      "reset": "Reset Configuration",
      "simulate": "Simulate Risk Profile",
      "saveLog": "Save Simulation Log",
      "modifyInputs": "Modify Inputs",
      "processing": "Forensic Neural Simulation Active"
    },
    "common": {
      "loading": "ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...",
      "backToExplorer": "ਵਾਪਸ ਐਕਸਪਲੋਰਰ",
      "backToDirectorate": "ਵਾਪਸ ਨਿਰਦੇਸ਼ਾਲਯ",
      "home": "ਮੁੱਖ ਪੰਨਾ",
      "noData": "ਕੋਈ ਡਾਟਾ ਉਪਲਬਧ ਨਹੀਂ",
      "openDossier": "ਦਸਤਾਵੇਜ਼ ਖੋਲ੍ਹੋ",
      "printBrief": "ਪ੍ਰਿੰਟ ਕਰੋ",
      "riskScore": "ਜੋਖਮ ਸਕੋਰ",
      "sanctionedAmount": "ਮਨਜ਼ੂਰ ਰਾਸ਼ੀ",
      "physicalProgress": "ਭੌਤਿਕ ਪ੍ਰਗਤੀ",
      "financialProgress": "ਵਿੱਤੀ ਪ੍ਰਗਤੀ",
      "contractor": "ਠੇਕੇਦਾਰ",
      "district": "ਜ਼ਿਲ੍ਹਾ",
      "state": "ਰਾਜ"
    }
  },
  "te": {
    "brand": "sanchay",
    "tagline": "ఎమ్మిల్యాడ్స్ ఫోరెన్సిక్ ఆడిటింగ్ & రిస్క్ ఇంటెలిజెన్స్",
    "header": {
      "context": "సందర్భం",
      "role": "పాత్ర",
      "askAgastya": "అగస్త్యను అడగండి"
    },
    "roles": {
      "MP": "ఎంపీ (లోక్‌సభ)",
      "DISTRICT_AUTHORITY": "జిల్లా కలెక్టర్",
      "STATE_NODAL": "రాష్ట్ర నోడల్",
      "MINISTRY_DIID": "మంత్రిత్వ శాఖ / MoSPI",
      "AUDITOR": "CAG ఆడిటర్"
    },
    "nav": {
      "myConstituency": "నా నియోజకవర్గం",
      "districtCommand": "జిల్లా కమాండ్",
      "stateCommand": "రాష్ట్ర కమాండ్",
      "nationalCommand": "జాతీయ కమాండ్",
      "auditOperations": "ఆడిట్ కార్యకలాపాలు",
      "forensicsWatch": "ఫోరెన్సిక్స్ & నిఘా",
      "forensicInvestigation": "ఫోరెన్సిక్ విచారణ",
      "financialsRisk": "ఆర్థికం & రిస్క్",
      "enforcement": "అమలు & రిస్క్",
      "intelligenceRisk": "ఇంటెలిజెన్స్ & రిస్క్",
      "governance": "పాలన",
      "policyGovernance": "విధానం & పాలన",
      "registries": "రిజిస్ట్రీలు",
      "reports": "నివేదికలు",
      "mpOverview": "ఎంపీ అవలోకనం",
      "districtOverview": "జిల్లా అవలోకనం",
      "stateOverview": "రాష్ట్ర అవలోకనం",
      "districtBreakdown": "జిల్లా వివరాలు",
      "ministryCommand": "మంత్రిత్వ కమాండ్",
      "stateTelemetry": "రాష్ట్ర టెలిమెట్రీ",
      "projectsExplorer": "ప్రాజెక్ట్ ఎక్స్‌ప్లోరర్",
      "constituencyMap": "నియోజకవర్గం మ్యాప్",
      "nationalMap": "జాతీయ మ్యాప్",
      "alertsWarnings": "హెచ్చరికలు",
      "nationalAlerts": "జాతీయ హెచ్చరికలు",
      "alertsFlags": "హెచ్చరిక ఫ్లాగ్‌లు",
      "casesDirectorate": "కేసుల డైరెక్టరేట్",
      "riskAssessment": "రిస్క్ అసెస్మెంట్",
      "riskSimulator": "రిస్క్ సిమ్యులేటర్",
      "complianceStatus": "పాటింపు స్థితి",
      "complianceTracker": "పాటింపు ట్రాకర్",
      "statutoryCompliance": "శాసనబద్ధ పాటింపు",
      "contractors": "కాంట్రాక్టర్లు",
      "agenciesOffice": "ఏజెన్సీల కార్యాలయం",
      "policiesRegistry": "విధానాల రిజిస్ట్రీ",
      "auditReports": "ఆడిట్ నివేదికలు",
      "nationalReports": "జాతీయ నివేదికలు"
    },
    "sidebarFooter": "MPLADS Guardian v3.0",
    "roleBadge": {
      "MP": "ఎంపీ వ్యూ",
      "DISTRICT_AUTHORITY": "జిల్లా వ్యూ",
      "STATE_NODAL": "రాష్ట్ర వ్యూ",
      "MINISTRY_DIID": "మంత్రిత్వ వ్యూ",
      "AUDITOR": "CAG వ్యూ"
    },
    "district": {
      "title": "DISTRICT COMMAND DASHBOARD",
      "subtitle": "Vigilance metrics & localized project delays",
      "cards": {
        "works": "District Works",
        "worksDesc": "Total monitored works in district",
        "sanctioned": "Total Sanctioned",
        "sanctionedDesc": "Approved allocations",
        "expenditure": "Expenditure",
        "expenditureDesc": "Reconciled spending",
        "criticalOverlaps": "Critical Overlaps",
        "criticalOverlapsDesc": "Works with risk score ≥ 80"
      },
      "charts": {
        "statusDistribution": "Works Status Distribution",
        "riskMatrix": "Risk Matrix Status Panel",
        "lowRisk": "Low Risk Works",
        "atRisk": "At-Risk Works"
      },
      "table": {
        "title": "Works Under Inspection",
        "code": "Code",
        "project": "Project Title",
        "sanctioned": "Sanctioned Amount",
        "physical": "Physical Progress",
        "risk": "Risk Score",
        "status": "Status",
        "actions": "Actions",
        "inspect": "Inspect Digital Twin",
        "loading": "Loading portfolio...",
        "noResults": "No works found for",
        "district": "district."
      }
    },
    "mp": {
      "title": "MP CONSTITUENCY TELEMETRY",
      "subtitle": "Constituency Financial & Physical Development Tracker",
      "cards": {
        "sanctioned": "Sanctioned Fund Allocation",
        "expenditure": "Expenditure Incurred",
        "activeWorks": "Active Works"
      },
      "table": {
        "title": "Constituency Civil Projects Portfolio",
        "code": "Code",
        "project": "Project Title",
        "sanctioned": "Sanctioned Amount",
        "physical": "Physical Progress",
        "financial": "Financial Progress",
        "actions": "Actions",
        "inspect": "Inspect Digital Twin",
        "loading": "Loading portfolio..."
      }
    },
    "ministry": {
      "title": "NATIONAL AUDIT TELEMETRY",
      "subtitle": "Ministry of Statistics & Programme Implementation (MoSPI) Command Centre",
      "cards": {
        "totalWorks": "Total Monitored Works",
        "totalWorksDesc": "Projects under supervision",
        "utilisation": "Utilisation Ratio",
        "critical": "Critical Risk Anomaly Flags",
        "criticalDesc": "Risk score ≥ 80",
        "totalFunds": "Total Sanctioned Funds",
        "totalFundsDesc": "Aggregate allocations"
      },
      "charts": {
        "stateOutlay": "State-wise Sanctioned Outlay (₹ Crores)"
      },
      "table": {
        "title": "State-wise Telemetry Breakdown",
        "state": "State Nodal Office",
        "totalWorks": "Total Works",
        "sanctioned": "Sanctioned Amount",
        "utilisation": "Utilisation %",
        "critical": "Critical Anomalies",
        "status": "Oversight Status",
        "activeMonitoring": "ACTIVE MONITORING"
      }
    },
    "projects": {
      "title": "FORENSIC PROJECTS EXPLORER",
      "subtitle": "Search and verify civil works, physical milestone updates, and transaction anomalies",
      "filter": {
        "search": "Search code, title, contractor...",
        "category": "All Categories",
        "status": "All Statuses",
        "risk": "All Risk Levels",
        "clear": "Clear Filters"
      },
      "table": {
        "title": "Civil Works Portfolio",
        "code": "Code",
        "project": "Project Title",
        "category": "Category",
        "sanctioned": "Sanctioned Amount",
        "physical": "Physical Progress",
        "risk": "Risk Score",
        "actions": "Actions",
        "inspectTwin": "Inspect Twin",
        "loading": "Querying project registries...",
        "noResults": "No projects match current filters."
      }
    },
    "alerts": {
      "title": "CRITICAL RISK ANOMALY FLAGS",
      "subtitle": "Real-time optical divergence, clustered contractor bidding, and SLA breaches",
      "whyFlagged": "Why Flagged",
      "ruleApplicability": "Rule Applicability",
      "slaDeadline": "SLA Deadline",
      "daysRemaining": "days remaining",
      "acknowledge": "Acknowledge",
      "resolveHold": "Enforce Hold / Resolve",
      "actionLogged": "Action Logged Successfully",
      "inspectTwin": "Inspect Twin Cockpit"
    },
    "riskAssessment": {
      "title": "RISK ASSESSMENT FORENSIC SIMULATOR",
      "subtitle": "Simulate tender bids deviation, progress mismatch triggers, and documentation deficit scores",
      "presets": "Simulation Presets",
      "configurator": "Forensic Variable Configurator",
      "identification": "Project Identification",
      "financials": "Financials & Performance",
      "tendering": "Tendering & Statutory Compliance",
      "reset": "Reset Configuration",
      "simulate": "Simulate Risk Profile",
      "saveLog": "Save Simulation Log",
      "modifyInputs": "Modify Inputs",
      "processing": "Forensic Neural Simulation Active"
    },
    "common": {
      "loading": "లోడ్ అవుతోంది...",
      "backToExplorer": "వెనక్కి ఎక్స్‌ప్లోరర్‌కు",
      "backToDirectorate": "వెనక్కి డైరెక్టరేట్‌కు",
      "home": "హోమ్",
      "noData": "సమాచారం లేదు",
      "openDossier": "డైరీ తెరవండి",
      "printBrief": "ప్రింట్ చేయండి",
      "riskScore": "రిస్క్ స్కోరు",
      "sanctionedAmount": "మంజూరైన మొత్తం",
      "physicalProgress": "భౌతిక పురోగతి",
      "financialProgress": "ఆర్థిక పురోగతి",
      "contractor": "కాంట్రాక్టర్",
      "district": "జిల్లా",
      "state": "రాష్ట్రం"
    }
  },
  "ta": {
    "brand": "sanchay",
    "tagline": "எம்பிஎல்ஏடிஎஸ் தடயவியல் தணிக்கை மற்றும் இடர் நுண்ணறிவு",
    "header": {
      "context": "சூழல்",
      "role": "பங்கு",
      "askAgastya": "அகஸ்தியாவிடம் கேளுங்கள்"
    },
    "roles": {
      "MP": "எம்பி (மக்களவை)",
      "DISTRICT_AUTHORITY": "மாவட்ட ஆட்சியர்",
      "STATE_NODAL": "மாநில நோடல்",
      "MINISTRY_DIID": "அமைச்சகம் / MoSPI",
      "AUDITOR": "CAG தணிக்கையாளர்"
    },
    "nav": {
      "myConstituency": "என் தொகுதி",
      "districtCommand": "மாவட்ட கட்டளை",
      "stateCommand": "மாநில கட்டளை",
      "nationalCommand": "தேசிய கட்டளை",
      "auditOperations": "தணிக்கை நடவடிக்கைகள்",
      "forensicsWatch": "தடயவியல் & கண்காணிப்பு",
      "forensicInvestigation": "தடயவியல் விசாரணை",
      "financialsRisk": "நிதி & இடர்",
      "enforcement": "அமலாக்கம் & இடர்",
      "intelligenceRisk": "நுண்ணறிவு & இடர்",
      "governance": "ஆளுகை",
      "policyGovernance": "கொள்கை & ஆளுகை",
      "registries": "பதிவேடுகள்",
      "reports": "அறிக்கைகள்",
      "mpOverview": "எம்பி மேலோட்டம்",
      "districtOverview": "மாவட்ட மேலோட்டம்",
      "stateOverview": "மாநில மேலோட்டம்",
      "districtBreakdown": "மாவட்ட விவரங்கள்",
      "ministryCommand": "அமைச்சக கட்டளை",
      "stateTelemetry": "மாநில டெலிமெட்ரி",
      "projectsExplorer": "திட்ட ஆய்வாளர்",
      "constituencyMap": "தொகுதி வரைபடம்",
      "nationalMap": "தேசிய வரைபடம்",
      "alertsWarnings": "எச்சரிக்கைகள்",
      "nationalAlerts": "தேசிய எச்சரிக்கைகள்",
      "alertsFlags": "எச்சரிக்கை கொடிகள்",
      "casesDirectorate": "வழக்குகள் இயக்கம்",
      "riskAssessment": "இடர் மதிப்பீடு",
      "riskSimulator": "இடர் சிமுலேட்டர்",
      "complianceStatus": "இணக்க நிலை",
      "complianceTracker": "இணக்க கண்காணிப்பு",
      "statutoryCompliance": "சட்டரீதியான இணக்கம்",
      "contractors": "காண்டிராக்டர்கள்",
      "agenciesOffice": "முகமைகள் அலுவலகம்",
      "policiesRegistry": "கொள்கைகள் பதிவேடு",
      "auditReports": "தணிக்கை அறிக்கைகள்",
      "nationalReports": "தேசிய அறிக்கைகள்"
    },
    "sidebarFooter": "MPLADS Guardian v3.0",
    "roleBadge": {
      "MP": "எம்பி பார்வை",
      "DISTRICT_AUTHORITY": "மாவட்ட பார்வை",
      "STATE_NODAL": "மாநில பார்வை",
      "MINISTRY_DIID": "அமைச்சக பார்வை",
      "AUDITOR": "CAG பார்வை"
    },
    "district": {
      "title": "DISTRICT COMMAND DASHBOARD",
      "subtitle": "Vigilance metrics & localized project delays",
      "cards": {
        "works": "District Works",
        "worksDesc": "Total monitored works in district",
        "sanctioned": "Total Sanctioned",
        "sanctionedDesc": "Approved allocations",
        "expenditure": "Expenditure",
        "expenditureDesc": "Reconciled spending",
        "criticalOverlaps": "Critical Overlaps",
        "criticalOverlapsDesc": "Works with risk score ≥ 80"
      },
      "charts": {
        "statusDistribution": "Works Status Distribution",
        "riskMatrix": "Risk Matrix Status Panel",
        "lowRisk": "Low Risk Works",
        "atRisk": "At-Risk Works"
      },
      "table": {
        "title": "Works Under Inspection",
        "code": "Code",
        "project": "Project Title",
        "sanctioned": "Sanctioned Amount",
        "physical": "Physical Progress",
        "risk": "Risk Score",
        "status": "Status",
        "actions": "Actions",
        "inspect": "Inspect Digital Twin",
        "loading": "Loading portfolio...",
        "noResults": "No works found for",
        "district": "district."
      }
    },
    "mp": {
      "title": "MP CONSTITUENCY TELEMETRY",
      "subtitle": "Constituency Financial & Physical Development Tracker",
      "cards": {
        "sanctioned": "Sanctioned Fund Allocation",
        "expenditure": "Expenditure Incurred",
        "activeWorks": "Active Works"
      },
      "table": {
        "title": "Constituency Civil Projects Portfolio",
        "code": "Code",
        "project": "Project Title",
        "sanctioned": "Sanctioned Amount",
        "physical": "Physical Progress",
        "financial": "Financial Progress",
        "actions": "Actions",
        "inspect": "Inspect Digital Twin",
        "loading": "Loading portfolio..."
      }
    },
    "ministry": {
      "title": "NATIONAL AUDIT TELEMETRY",
      "subtitle": "Ministry of Statistics & Programme Implementation (MoSPI) Command Centre",
      "cards": {
        "totalWorks": "Total Monitored Works",
        "totalWorksDesc": "Projects under supervision",
        "utilisation": "Utilisation Ratio",
        "critical": "Critical Risk Anomaly Flags",
        "criticalDesc": "Risk score ≥ 80",
        "totalFunds": "Total Sanctioned Funds",
        "totalFundsDesc": "Aggregate allocations"
      },
      "charts": {
        "stateOutlay": "State-wise Sanctioned Outlay (₹ Crores)"
      },
      "table": {
        "title": "State-wise Telemetry Breakdown",
        "state": "State Nodal Office",
        "totalWorks": "Total Works",
        "sanctioned": "Sanctioned Amount",
        "utilisation": "Utilisation %",
        "critical": "Critical Anomalies",
        "status": "Oversight Status",
        "activeMonitoring": "ACTIVE MONITORING"
      }
    },
    "projects": {
      "title": "FORENSIC PROJECTS EXPLORER",
      "subtitle": "Search and verify civil works, physical milestone updates, and transaction anomalies",
      "filter": {
        "search": "Search code, title, contractor...",
        "category": "All Categories",
        "status": "All Statuses",
        "risk": "All Risk Levels",
        "clear": "Clear Filters"
      },
      "table": {
        "title": "Civil Works Portfolio",
        "code": "Code",
        "project": "Project Title",
        "category": "Category",
        "sanctioned": "Sanctioned Amount",
        "physical": "Physical Progress",
        "risk": "Risk Score",
        "actions": "Actions",
        "inspectTwin": "Inspect Twin",
        "loading": "Querying project registries...",
        "noResults": "No projects match current filters."
      }
    },
    "alerts": {
      "title": "CRITICAL RISK ANOMALY FLAGS",
      "subtitle": "Real-time optical divergence, clustered contractor bidding, and SLA breaches",
      "whyFlagged": "Why Flagged",
      "ruleApplicability": "Rule Applicability",
      "slaDeadline": "SLA Deadline",
      "daysRemaining": "days remaining",
      "acknowledge": "Acknowledge",
      "resolveHold": "Enforce Hold / Resolve",
      "actionLogged": "Action Logged Successfully",
      "inspectTwin": "Inspect Twin Cockpit"
    },
    "riskAssessment": {
      "title": "RISK ASSESSMENT FORENSIC SIMULATOR",
      "subtitle": "Simulate tender bids deviation, progress mismatch triggers, and documentation deficit scores",
      "presets": "Simulation Presets",
      "configurator": "Forensic Variable Configurator",
      "identification": "Project Identification",
      "financials": "Financials & Performance",
      "tendering": "Tendering & Statutory Compliance",
      "reset": "Reset Configuration",
      "simulate": "Simulate Risk Profile",
      "saveLog": "Save Simulation Log",
      "modifyInputs": "Modify Inputs",
      "processing": "Forensic Neural Simulation Active"
    },
    "common": {
      "loading": "ஏற்றப்படுகிறது...",
      "backToExplorer": "ஆய்வாளருக்குத் திரும்பு",
      "backToDirectorate": "இயக்ககத்திற்குத் திரும்பு",
      "home": "முகப்பு",
      "noData": "தரவு எதுவும் இல்லை",
      "openDossier": "ஆவணங்களைத் திற",
      "printBrief": "அச்சிடு",
      "riskScore": "இடர் மதிப்பெண்",
      "sanctionedAmount": "ஒப்புதல் தொகை",
      "physicalProgress": "பௌதிக முன்னேற்றம்",
      "financialProgress": "நிதி முன்னேற்றம்",
      "contractor": "காண்டிராக்டர்",
      "district": "மாவட்டம்",
      "state": "மாநிலம்"
    }
  },
  "ur": {
    "brand": "sanchay",
    "tagline": "ایم پی ایل اے ڈی ایس فارنسک آڈٹ اور رسک انٹیلی جنس",
    "header": {
      "context": "سیاق و سباق",
      "role": "کردار",
      "askAgastya": "اگستیہ سے پوچھیں"
    },
    "roles": {
      "MP": "ایم پی (لوک سبھا)",
      "DISTRICT_AUTHORITY": "ضلع کلیکٹر",
      "STATE_NODAL": "ریاستی نوڈل",
      "MINISTRY_DIID": "وزارت / MoSPI",
      "AUDITOR": "سی اے جی آڈیٹر"
    },
    "nav": {
      "myConstituency": "میرا حلقہ",
      "districtCommand": "ضلعی کمانڈ",
      "stateCommand": "ریاستی کمانڈ",
      "nationalCommand": "قومی کمانڈ",
      "auditOperations": "آڈٹ آپریشنز",
      "forensicsWatch": "فارنسک اور نگرانی",
      "forensicInvestigation": "فارنسک تحقیقات",
      "financialsRisk": "مالیات اور رسک",
      "enforcement": "انفاذ اور رسک",
      "intelligenceRisk": "انٹیلی جنس اور رسک",
      "governance": "حکمرانی",
      "policyGovernance": "پالیسی اور حکمرانی",
      "registries": "رجسٹریاں",
      "reports": "رپورٹیں",
      "mpOverview": "ایم پی جائزہ",
      "districtOverview": "ضلعی جائزہ",
      "stateOverview": "ریاستی جائزہ",
      "districtBreakdown": "ضلعی تفصیلات",
      "ministryCommand": "وزارتی کمانڈ",
      "stateTelemetry": "ریاستی ٹیلی میٹری",
      "projectsExplorer": "پروجیکٹ ایکسپلورر",
      "constituencyMap": "حلقے کا نقشہ",
      "nationalMap": "قومی نقشہ",
      "alertsWarnings": "انتباہات",
      "nationalAlerts": "قومی انتباہات",
      "alertsFlags": "الرٹ فلیگز",
      "casesDirectorate": "کیسز ڈائریکٹوریٹ",
      "riskAssessment": "رسک اسیسمنٹ",
      "riskSimulator": "رسک سمیلیٹر",
      "complianceStatus": "تعمیل کی صورتحال",
      "complianceTracker": "تعمیل ٹریکر",
      "statutoryCompliance": "قانونی تعمیل",
      "contractors": "ٹھیکیدار",
      "agenciesOffice": "ایجنسیاں دفتر",
      "policiesRegistry": "پالیسیاں رجسٹر",
      "auditReports": "آڈٹ رپورٹیں",
      "nationalReports": "قومی رپورٹیں"
    },
    "sidebarFooter": "MPLADS Guardian v3.0",
    "roleBadge": {
      "MP": "ایم پی ویو",
      "DISTRICT_AUTHORITY": "ضلعی ویو",
      "STATE_NODAL": "ریاستی ویو",
      "MINISTRY_DIID": "وزارتی ویو",
      "AUDITOR": "سی اے جی ویو"
    },
    "district": {
      "title": "DISTRICT COMMAND DASHBOARD",
      "subtitle": "Vigilance metrics & localized project delays",
      "cards": {
        "works": "District Works",
        "worksDesc": "Total monitored works in district",
        "sanctioned": "Total Sanctioned",
        "sanctionedDesc": "Approved allocations",
        "expenditure": "Expenditure",
        "expenditureDesc": "Reconciled spending",
        "criticalOverlaps": "Critical Overlaps",
        "criticalOverlapsDesc": "Works with risk score ≥ 80"
      },
      "charts": {
        "statusDistribution": "Works Status Distribution",
        "riskMatrix": "Risk Matrix Status Panel",
        "lowRisk": "Low Risk Works",
        "atRisk": "At-Risk Works"
      },
      "table": {
        "title": "Works Under Inspection",
        "code": "Code",
        "project": "Project Title",
        "sanctioned": "Sanctioned Amount",
        "physical": "Physical Progress",
        "risk": "Risk Score",
        "status": "Status",
        "actions": "Actions",
        "inspect": "Inspect Digital Twin",
        "loading": "Loading portfolio...",
        "noResults": "No works found for",
        "district": "district."
      }
    },
    "mp": {
      "title": "MP CONSTITUENCY TELEMETRY",
      "subtitle": "Constituency Financial & Physical Development Tracker",
      "cards": {
        "sanctioned": "Sanctioned Fund Allocation",
        "expenditure": "Expenditure Incurred",
        "activeWorks": "Active Works"
      },
      "table": {
        "title": "Constituency Civil Projects Portfolio",
        "code": "Code",
        "project": "Project Title",
        "sanctioned": "Sanctioned Amount",
        "physical": "Physical Progress",
        "financial": "Financial Progress",
        "actions": "Actions",
        "inspect": "Inspect Digital Twin",
        "loading": "Loading portfolio..."
      }
    },
    "ministry": {
      "title": "NATIONAL AUDIT TELEMETRY",
      "subtitle": "Ministry of Statistics & Programme Implementation (MoSPI) Command Centre",
      "cards": {
        "totalWorks": "Total Monitored Works",
        "totalWorksDesc": "Projects under supervision",
        "utilisation": "Utilisation Ratio",
        "critical": "Critical Risk Anomaly Flags",
        "criticalDesc": "Risk score ≥ 80",
        "totalFunds": "Total Sanctioned Funds",
        "totalFundsDesc": "Aggregate allocations"
      },
      "charts": {
        "stateOutlay": "State-wise Sanctioned Outlay (₹ Crores)"
      },
      "table": {
        "title": "State-wise Telemetry Breakdown",
        "state": "State Nodal Office",
        "totalWorks": "Total Works",
        "sanctioned": "Sanctioned Amount",
        "utilisation": "Utilisation %",
        "critical": "Critical Anomalies",
        "status": "Oversight Status",
        "activeMonitoring": "ACTIVE MONITORING"
      }
    },
    "projects": {
      "title": "FORENSIC PROJECTS EXPLORER",
      "subtitle": "Search and verify civil works, physical milestone updates, and transaction anomalies",
      "filter": {
        "search": "Search code, title, contractor...",
        "category": "All Categories",
        "status": "All Statuses",
        "risk": "All Risk Levels",
        "clear": "Clear Filters"
      },
      "table": {
        "title": "Civil Works Portfolio",
        "code": "Code",
        "project": "Project Title",
        "category": "Category",
        "sanctioned": "Sanctioned Amount",
        "physical": "Physical Progress",
        "risk": "Risk Score",
        "actions": "Actions",
        "inspectTwin": "Inspect Twin",
        "loading": "Querying project registries...",
        "noResults": "No projects match current filters."
      }
    },
    "alerts": {
      "title": "CRITICAL RISK ANOMALY FLAGS",
      "subtitle": "Real-time optical divergence, clustered contractor bidding, and SLA breaches",
      "whyFlagged": "Why Flagged",
      "ruleApplicability": "Rule Applicability",
      "slaDeadline": "SLA Deadline",
      "daysRemaining": "days remaining",
      "acknowledge": "Acknowledge",
      "resolveHold": "Enforce Hold / Resolve",
      "actionLogged": "Action Logged Successfully",
      "inspectTwin": "Inspect Twin Cockpit"
    },
    "riskAssessment": {
      "title": "RISK ASSESSMENT FORENSIC SIMULATOR",
      "subtitle": "Simulate tender bids deviation, progress mismatch triggers, and documentation deficit scores",
      "presets": "Simulation Presets",
      "configurator": "Forensic Variable Configurator",
      "identification": "Project Identification",
      "financials": "Financials & Performance",
      "tendering": "Tendering & Statutory Compliance",
      "reset": "Reset Configuration",
      "simulate": "Simulate Risk Profile",
      "saveLog": "Save Simulation Log",
      "modifyInputs": "Modify Inputs",
      "processing": "Forensic Neural Simulation Active"
    },
    "common": {
      "loading": "لوڈ ہو رہا ہے...",
      "backToExplorer": "واپس ایکسپلورر پر",
      "backToDirectorate": "واپس ڈائریکٹوریٹ پر",
      "home": "ہوم",
      "noData": "کوئی ڈیٹا دستیاب نہیں ہے",
      "openDossier": "دستاویزات کھولیں",
      "printBrief": "پرنٹ کریں",
      "riskScore": "رسک اسکور",
      "sanctionedAmount": "منظور شدہ رقم",
      "physicalProgress": "جسمانی پیشرفت",
      "financialProgress": "مالیاتی پیشرفت",
      "contractor": "ٹھیکیدار",
      "district": "ضلع",
      "state": "ریاست"
    }
  }
};

export type TranslationKeys = typeof translations.en;
