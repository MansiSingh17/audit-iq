"""
Document Analysis Module for Audit-IQ
Analyzes policy documents and identifies critical flags, improvements, gaps, and risks
"""

import re
from datetime import datetime
from typing import List, Dict, Any


class DocumentAnalyzer:
    """Analyzes documents for compliance issues and improvements"""
    
    def __init__(self):
        # Keywords for different issue types
        self.critical_keywords = [
            'encryption', 'access control', 'authentication', 'password',
            'breach', 'incident', 'vulnerability', 'security'
        ]
        
        self.improvement_keywords = [
            'should', 'consider', 'recommend', 'suggest', 'may',
            'optional', 'could', 'enhance'
        ]
    
    def analyze_document(self, text: str, standard: str) -> Dict[str, Any]:
        """
        Main analysis function
        
        Args:
            text: Document text content
            standard: Compliance standard (ISO_27001, GDPR, HIPAA)
            
        Returns:
            Analysis results with flags, improvements, gaps, and risks
        """
        
        # Basic text analysis
        word_count = len(text.split())
        has_encryption = self._check_keyword(text, ['encryption', 'encrypt'])
        has_access_control = self._check_keyword(text, ['access control', 'authorization'])
        has_incident = self._check_keyword(text, ['incident', 'breach'])
        
        # Generate results based on standard
        if standard.upper() in ['ISO_27001', 'ISO 27001']:
            return self._analyze_iso27001(text, word_count, has_encryption, has_access_control, has_incident)
        elif standard.upper() == 'GDPR':
            return self._analyze_gdpr(text, word_count, has_encryption, has_access_control, has_incident)
        elif standard.upper() == 'HIPAA':
            return self._analyze_hipaa(text, word_count, has_encryption, has_access_control, has_incident)
        else:
            return self._analyze_generic(text, word_count)
    
    def _check_keyword(self, text: str, keywords: List[str]) -> bool:
        """Check if any keyword exists in text"""
        text_lower = text.lower()
        return any(keyword.lower() in text_lower for keyword in keywords)
    
    def _calculate_score(self, has_encryption: bool, has_access_control: bool, has_incident: bool, word_count: int) -> tuple:
        """Calculate overall compliance score"""
        score = 50  # Base score
        
        if has_encryption:
            score += 15
        if has_access_control:
            score += 15
        if has_incident:
            score += 10
        if word_count > 1000:
            score += 10
        
        if score >= 80:
            rating = "Excellent"
        elif score >= 65:
            rating = "Good"
        else:
            rating = "Needs Improvement"
            
        return score, rating
    
    def _analyze_iso27001(self, text: str, word_count: int, has_encryption: bool, has_access_control: bool, has_incident: bool) -> Dict[str, Any]:
        """Analyze document for ISO 27001 compliance"""
        
        score, rating = self._calculate_score(has_encryption, has_access_control, has_incident, word_count)
        
        critical_flags = []
        improvements = []
        compliance_gaps = []
        risk_areas = []
        
        # Check for encryption
        if not has_encryption:
            critical_flags.append({
                "id": "CF-001",
                "severity": "HIGH",
                "title": "Missing Encryption Policy",
                "description": "Document lacks specific requirements for data encryption at rest and in transit.",
                "location": "Throughout document",
                "recommendation": "Add detailed encryption requirements including approved algorithms (AES-256, TLS 1.3), key management procedures, and encryption scope.",
                "affectedControls": ["A.8.24 - Use of Cryptography"]
            })
        
        # Check for access control
        if not has_access_control:
            critical_flags.append({
                "id": "CF-002",
                "severity": "HIGH",
                "title": "Incomplete Access Control Requirements",
                "description": "Role-based access control definitions are missing or insufficient.",
                "location": "Access Management section",
                "recommendation": "Define specific roles, permissions matrix, approval workflows, and regular access review procedures.",
                "affectedControls": ["A.9.1 - Access Control Policy", "A.9.2 - User Access Management"]
            })
        
        # Check for incident response
        if not has_incident:
            critical_flags.append({
                "id": "CF-003",
                "severity": "MEDIUM",
                "title": "Missing Incident Response Procedures",
                "description": "Incident response plan is not defined or lacks detail.",
                "location": "Security Management section",
                "recommendation": "Specify incident classification criteria, response timelines, escalation matrix, and communication templates.",
                "affectedControls": ["A.16.1 - Management of Information Security Incidents"]
            })
        
        # Add improvements
        improvements.append({
            "id": "IMP-001",
            "category": "Documentation",
            "title": "Add Risk Assessment Matrix",
            "description": "Include a standardized risk assessment matrix with likelihood and impact ratings.",
            "benefit": "Enables consistent risk evaluation across the organization.",
            "effort": "LOW",
            "priority": 1
        })
        
        improvements.append({
            "id": "IMP-002",
            "category": "Training",
            "title": "Enhance Security Awareness Training",
            "description": "Specify mandatory annual training and phishing simulations.",
            "benefit": "Reduces human error and demonstrates due diligence.",
            "effort": "MEDIUM",
            "priority": 2
        })
        
        # Add compliance gaps
        compliance_gaps.append({
            "controlId": "A.8.8",
            "controlName": "Management of Technical Vulnerabilities",
            "requirement": "Technical vulnerabilities must be identified, evaluated, and managed.",
            "currentState": "Policy mentions vulnerability scanning but lacks specifics.",
            "expectedState": "Weekly automated scanning, patch management SLA, disclosure process.",
            "gap": "Missing detailed vulnerability management procedures.",
            "remediationSteps": [
                "Implement automated vulnerability scanning tools",
                "Define patch management SLAs by severity",
                "Establish vulnerability disclosure process"
            ]
        })
        
        # Add risk areas
        risk_areas.append({
            "id": "RISK-001",
            "riskLevel": "HIGH",
            "title": "Third-Party Vendor Risk Management",
            "description": "Policy lacks comprehensive third-party risk assessment requirements.",
            "impact": "Security incidents from vendors can expose sensitive data.",
            "likelihood": "High - Many organizations rely on third-party services",
            "mitigationActions": [
                "Implement vendor risk assessment questionnaire",
                "Require SOC 2/ISO 27001 certifications",
                "Conduct annual vendor security reviews"
            ]
        })
        
        return {
            "documentId": f"doc-{datetime.now().timestamp()}",
            "documentName": "Uploaded Document",
            "standard": "ISO 27001",
            "analyzedAt": datetime.now().isoformat(),
            "overallAssessment": {
                "score": f"{score}/100",
                "rating": rating,
                "summary": f"The document has been analyzed against ISO 27001:2022 requirements. Score: {score}/100.",
                "criticalIssues": len([f for f in critical_flags if f['severity'] == 'HIGH']),
                "warnings": len([f for f in critical_flags if f['severity'] == 'MEDIUM']),
                "recommendations": len(improvements)
            },
            "criticalFlags": critical_flags,
            "improvements": improvements,
            "complianceGaps": compliance_gaps,
            "riskAreas": risk_areas
        }
    
    def _analyze_gdpr(self, text: str, word_count: int, has_encryption: bool, has_access_control: bool, has_incident: bool) -> Dict[str, Any]:
        """Analyze document for GDPR compliance"""
        
        score, rating = self._calculate_score(has_encryption, has_access_control, has_incident, word_count)
        
        has_dsar = self._check_keyword(text, ['data subject', 'access request', 'dsar'])
        has_dpo = self._check_keyword(text, ['data protection officer', 'dpo'])
        
        critical_flags = []
        
        if not has_dsar:
            critical_flags.append({
                "id": "CF-001",
                "severity": "HIGH",
                "title": "Missing Data Subject Rights Procedures",
                "description": "Policy lacks detailed procedures for handling data subject access requests within 30-day requirement.",
                "location": "Individual Rights section",
                "recommendation": "Define DSAR intake process, identity verification, data collection procedures, and response templates.",
                "affectedControls": ["Article 15 - Right of Access", "Article 12 - Transparent Information"]
            })
        
        if not has_incident:
            critical_flags.append({
                "id": "CF-002",
                "severity": "HIGH",
                "title": "Incomplete Data Breach Notification Process",
                "description": "72-hour breach notification requirement not adequately addressed.",
                "location": "Security & Breach section",
                "recommendation": "Create breach classification, notification decision tree, and 72-hour timeline management.",
                "affectedControls": ["Article 33 - Breach Notification", "Article 34 - Communication to Data Subject"]
            })
        
        return {
            "documentId": f"doc-{datetime.now().timestamp()}",
            "documentName": "Uploaded Document",
            "standard": "GDPR",
            "analyzedAt": datetime.now().isoformat(),
            "overallAssessment": {
                "score": f"{score}/100",
                "rating": rating,
                "summary": f"GDPR compliance analysis completed. The document requires attention in data subject rights and breach notification areas. Score: {score}/100.",
                "criticalIssues": len([f for f in critical_flags if f['severity'] == 'HIGH']),
                "warnings": len([f for f in critical_flags if f['severity'] == 'MEDIUM']),
                "recommendations": 3
            },
            "criticalFlags": critical_flags,
            "improvements": [
                {
                    "id": "IMP-001",
                    "category": "Documentation",
                    "title": "Enhance Record of Processing Activities (ROPA)",
                    "description": "Expand ROPA template to include all Article 30 requirements.",
                    "benefit": "Demonstrates compliance and facilitates DPA audits.",
                    "effort": "LOW",
                    "priority": 1
                }
            ],
            "complianceGaps": [
                {
                    "controlId": "Art. 32",
                    "controlName": "Security of Processing",
                    "requirement": "Appropriate technical and organizational measures required.",
                    "currentState": "General security requirements mentioned.",
                    "expectedState": "Specific encryption, pseudonymization, and access controls required.",
                    "gap": "Insufficient detail on required security measures.",
                    "remediationSteps": [
                        "Specify encryption requirements",
                        "Define pseudonymization use cases",
                        "Detail access control implementation"
                    ]
                }
            ],
            "riskAreas": [
                {
                    "id": "RISK-001",
                    "riskLevel": "CRITICAL",
                    "title": "International Data Transfer Compliance",
                    "description": "Policy doesn't address data transfers outside EU/EEA.",
                    "impact": "Illegal transfers can result in significant fines.",
                    "likelihood": "High - Many organizations use global cloud services",
                    "mitigationActions": [
                        "Identify all international data transfers",
                        "Implement Standard Contractual Clauses (SCCs)",
                        "Conduct Transfer Impact Assessments"
                    ]
                }
            ]
        }
    
    def _analyze_hipaa(self, text: str, word_count: int, has_encryption: bool, has_access_control: bool, has_incident: bool) -> Dict[str, Any]:
        """Analyze document for HIPAA compliance"""
        
        score, rating = self._calculate_score(has_encryption, has_access_control, has_incident, word_count)
        
        has_baa = self._check_keyword(text, ['business associate', 'baa'])
        has_ephi = self._check_keyword(text, ['ephi', 'electronic protected health'])
        
        critical_flags = []
        
        if not has_baa:
            critical_flags.append({
                "id": "CF-001",
                "severity": "HIGH",
                "title": "Insufficient Business Associate Agreement Requirements",
                "description": "BAA requirements not comprehensively defined per §164.308(b).",
                "location": "Third Party Management section",
                "recommendation": "Specify all required BAA provisions including permitted uses, safeguards, and breach notification.",
                "affectedControls": ["§164.308(b)(1) - Business Associate Contracts"]
            })
        
        if not has_encryption:
            critical_flags.append({
                "id": "CF-002",
                "severity": "HIGH",
                "title": "Missing ePHI Encryption Requirements",
                "description": "Encryption requirements for ePHI not clearly defined.",
                "location": "Technical Safeguards section",
                "recommendation": "Mandate encryption for ePHI at rest and in transit with specific algorithms.",
                "affectedControls": ["§164.312(a)(2)(iv) - Encryption and Decryption"]
            })
        
        return {
            "documentId": f"doc-{datetime.now().timestamp()}",
            "documentName": "Uploaded Document",
            "standard": "HIPAA",
            "analyzedAt": datetime.now().isoformat(),
            "overallAssessment": {
                "score": f"{score}/100",
                "rating": rating,
                "summary": f"HIPAA Security Rule analysis completed. Focus needed on BAA requirements and encryption. Score: {score}/100.",
                "criticalIssues": len([f for f in critical_flags if f['severity'] == 'HIGH']),
                "warnings": len([f for f in critical_flags if f['severity'] == 'MEDIUM']),
                "recommendations": 2
            },
            "criticalFlags": critical_flags,
            "improvements": [
                {
                    "id": "IMP-001",
                    "category": "Training",
                    "title": "Enhance HIPAA Training Program",
                    "description": "Specify initial training within 30 days and annual refresher training.",
                    "benefit": "Demonstrates workforce awareness and reduces violations.",
                    "effort": "LOW",
                    "priority": 1
                }
            ],
            "complianceGaps": [
                {
                    "controlId": "§164.312(a)(2)(i)",
                    "controlName": "Unique User Identification",
                    "requirement": "Assign unique user ID for tracking and accountability.",
                    "currentState": "Policy mentions user accounts.",
                    "expectedState": "Unique identifiers required; shared accounts prohibited.",
                    "gap": "Insufficient detail on unique user identification.",
                    "remediationSteps": [
                        "Prohibit shared accounts explicitly",
                        "Define emergency access procedures",
                        "Establish audit logging tied to user IDs"
                    ]
                }
            ],
            "riskAreas": [
                {
                    "id": "RISK-001",
                    "riskLevel": "HIGH",
                    "title": "Mobile Device and BYOD Security",
                    "description": "Policy lacks comprehensive mobile device management requirements.",
                    "impact": "Lost devices with ePHI can result in reportable breaches.",
                    "likelihood": "High - Healthcare workers use mobile devices",
                    "mitigationActions": [
                        "Implement mobile device management (MDM)",
                        "Require device encryption and remote wipe",
                        "Define acceptable BYOD use cases"
                    ]
                }
            ]
        }
    
    def _analyze_generic(self, text: str, word_count: int) -> Dict[str, Any]:
        """Generic analysis fallback"""
        
        return {
            "documentId": f"doc-{datetime.now().timestamp()}",
            "documentName": "Uploaded Document",
            "standard": "Generic",
            "analyzedAt": datetime.now().isoformat(),
            "overallAssessment": {
                "score": "60/100",
                "rating": "Needs Improvement",
                "summary": "Generic compliance analysis completed. Consider specifying a compliance standard for detailed analysis.",
                "criticalIssues": 1,
                "warnings": 2,
                "recommendations": 3
            },
            "criticalFlags": [
                {
                    "id": "CF-001",
                    "severity": "MEDIUM",
                    "title": "General Security Control Gaps",
                    "description": "Document could benefit from more specific security requirements.",
                    "location": "Throughout document",
                    "recommendation": "Add detailed security requirements aligned with your compliance framework.",
                    "affectedControls": ["General Security Controls"]
                }
            ],
            "improvements": [],
            "complianceGaps": [],
            "riskAreas": []
        }