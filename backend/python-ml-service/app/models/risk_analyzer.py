from transformers import pipeline
import torch
from app.config import Config
from app.utils.logger import get_logger
import re

logger = get_logger(__name__)

class RiskAnalyzer:
    """Analyze compliance risks using NLP"""
    
    def __init__(self):
        self.device = 0 if torch.cuda.is_available() else -1
        logger.info(f'Initializing risk analyzer on device: {self.device}')
        
        # Initialize sentiment analysis for risk detection
        self.sentiment_analyzer = pipeline(
            "sentiment-analysis",
            model="distilbert-base-uncased-finetuned-sst-2-english",
            device=self.device
        )
        
        self.risk_patterns = self._load_risk_patterns()
        self.thresholds = Config.RISK_THRESHOLDS
        
        logger.info('Risk analyzer initialized successfully')
    
    def _load_risk_patterns(self):
        """Load risk detection patterns"""
        return {
            'ISO_27001': {
                'critical': [
                    r'no\s+(?:encryption|security|protection)',
                    r'(?:password|credential)s?\s+(?:shared|weak|default)',
                    r'(?:unauthorized|uncontrolled)\s+access',
                    r'(?:missing|no|lack\s+of)\s+(?:backup|logging|monitoring)'
                ],
                'high': [
                    r'(?:outdated|legacy|unsupported)\s+(?:system|software)',
                    r'(?:insufficient|inadequate)\s+(?:training|documentation)',
                    r'(?:no|missing)\s+(?:policy|procedure|process)',
                    r'(?:unpatched|vulnerable)'
                ],
                'medium': [
                    r'(?:limited|partial)\s+(?:coverage|implementation)',
                    r'(?:manual|informal)\s+process',
                    r'(?:inconsistent|irregular)\s+(?:review|audit)'
                ]
            },
            'GDPR': {
                'critical': [
                    r'(?:no|missing)\s+consent',
                    r'(?:personal|sensitive)\s+data\s+(?:breach|exposure)',
                    r'(?:inadequate|no)\s+data\s+protection',
                    r'(?:missing|no)\s+(?:privacy\s+policy|dpo)'
                ],
                'high': [
                    r'(?:unclear|missing)\s+legal\s+basis',
                    r'(?:inadequate|no)\s+data\s+subject\s+rights',
                    r'(?:missing|no)\s+(?:dpia|privacy\s+impact)',
                    r'(?:excessive|unnecessary)\s+data\s+collection'
                ],
                'medium': [
                    r'(?:incomplete|partial)\s+documentation',
                    r'(?:unclear|ambiguous)\s+retention',
                    r'(?:limited|insufficient)\s+transparency'
                ]
            },
            'HIPAA': {
                'critical': [
                    r'(?:unencrypted|unsecured)\s+(?:phi|patient\s+data)',
                    r'(?:unauthorized|improper)\s+(?:access|disclosure)',
                    r'(?:no|missing)\s+(?:authorization|consent)',
                    r'(?:inadequate|no)\s+physical\s+security'
                ],
                'high': [
                    r'(?:insufficient|weak)\s+authentication',
                    r'(?:missing|incomplete)\s+(?:baa|agreement)',
                    r'(?:inadequate|no)\s+(?:training|awareness)',
                    r'(?:no|missing)\s+(?:audit\s+trail|logging)'
                ],
                'medium': [
                    r'(?:limited|partial)\s+risk\s+analysis',
                    r'(?:informal|undocumented)\s+procedure',
                    r'(?:inconsistent|irregular)\s+review'
                ]
            }
        }
    
    def analyze(self, text, standard='ISO_27001'):
        """Analyze text for compliance risks"""
        try:
            logger.info(f'Analyzing risks for {standard}')
            
            # Detect risk patterns
            findings = self._detect_risks(text, standard)
            
            # Calculate risk scores
            risk_score = self._calculate_risk_score(findings)
            risk_level = self._get_risk_level(risk_score)
            
            # Generate recommendations
            recommendations = self._generate_recommendations(findings, standard)
            
            # Generate summary
            summary = self._generate_summary(findings, risk_level, standard)
            
            result = {
                'success': True,
                'standard': standard,
                'overall_risk_score': round(risk_score, 2),
                'overall_risk_level': risk_level,
                'total_findings': len(findings),
                'findings': findings,
                'recommendations': recommendations,
                'summary': summary,
                'statistics': self._calculate_statistics(findings)
            }
            
            logger.info(f'Risk analysis complete: {risk_level} risk with {len(findings)} findings')
            return result
            
        except Exception as e:
            logger.error(f'Error in risk analysis: {str(e)}')
            raise
    
    def _detect_risks(self, text, standard):
        """Detect risk patterns in text"""
        findings = []
        text_lower = text.lower()
        patterns = self.risk_patterns.get(standard, self.risk_patterns['ISO_27001'])
        
        finding_id = 1
        
        # Check critical patterns
        for pattern in patterns.get('critical', []):
            matches = re.finditer(pattern, text_lower)
            for match in matches:
                finding = self._create_finding(
                    finding_id,
                    'CRITICAL',
                    match.group(),
                    standard,
                    'security_control'
                )
                findings.append(finding)
                finding_id += 1
        
        # Check high patterns
        for pattern in patterns.get('high', []):
            matches = re.finditer(pattern, text_lower)
            for match in matches:
                finding = self._create_finding(
                    finding_id,
                    'HIGH',
                    match.group(),
                    standard,
                    'compliance_gap'
                )
                findings.append(finding)
                finding_id += 1
        
        # Check medium patterns
        for pattern in patterns.get('medium', []):
            matches = re.finditer(pattern, text_lower)
            for match in matches:
                finding = self._create_finding(
                    finding_id,
                    'MEDIUM',
                    match.group(),
                    standard,
                    'process_improvement'
                )
                findings.append(finding)
                finding_id += 1
        
        # Limit to top 15 findings
        return findings[:15]
    
    def _create_finding(self, finding_id, severity, matched_text, standard, category):
        """Create a risk finding"""
        risk_scores = {'CRITICAL': 0.95, 'HIGH': 0.75, 'MEDIUM': 0.50, 'LOW': 0.25}
        
        return {
            'id': f'RISK_{finding_id:03d}',
            'category': category,
            'severity': severity,
            'risk_score': risk_scores[severity],
            'issue': self._describe_issue(matched_text, severity, standard),
            'impact': self._describe_impact(severity, standard),
            'recommendation': self._describe_remediation(matched_text, severity, standard),
            'affected_control': f'{standard} Control {finding_id}',
            'priority': self._get_remediation_priority(severity)
        }
    
    def _describe_issue(self, matched_text, severity, standard):
        """Generate issue description"""
        descriptions = {
            'CRITICAL': f'Critical compliance gap identified: {matched_text}. Immediate action required.',
            'HIGH': f'Significant risk detected: {matched_text}. Should be addressed promptly.',
            'MEDIUM': f'Compliance concern found: {matched_text}. Should be reviewed and improved.',
            'LOW': f'Minor issue noted: {matched_text}. Consider enhancement.'
        }
        return descriptions.get(severity, f'Risk identified in {standard} compliance: {matched_text}')
    
    def _describe_impact(self, severity, standard):
        """Generate impact description"""
        impacts = {
            'CRITICAL': f'May result in {standard} non-compliance, regulatory penalties, and security breaches.',
            'HIGH': f'Could lead to {standard} audit findings and increased security risk.',
            'MEDIUM': f'May affect {standard} compliance posture and operational efficiency.',
            'LOW': f'Minor impact on {standard} compliance and security posture.'
        }
        return impacts.get(severity, f'Potential impact on {standard} compliance')
    
    def _describe_remediation(self, matched_text, severity, standard):
        """Generate remediation recommendation"""
        if 'encryption' in matched_text or 'security' in matched_text:
            return 'Implement encryption and security controls immediately. Review and update security policies.'
        elif 'password' in matched_text or 'credential' in matched_text:
            return 'Enforce strong password policies and implement multi-factor authentication.'
        elif 'access' in matched_text:
            return 'Implement role-based access control and regular access reviews.'
        elif 'backup' in matched_text or 'monitoring' in matched_text:
            return 'Deploy automated backup solutions and continuous monitoring systems.'
        elif 'policy' in matched_text or 'procedure' in matched_text:
            return 'Develop, document, and communicate required policies and procedures.'
        elif 'consent' in matched_text or 'privacy' in matched_text:
            return 'Implement consent management and privacy controls.'
        else:
            return f'Review and remediate identified {standard} compliance gap.'
    
    def _get_remediation_priority(self, severity):
        """Get remediation timeline priority"""
        priorities = {
            'CRITICAL': 'IMMEDIATE',
            'HIGH': 'SHORT_TERM',
            'MEDIUM': 'MEDIUM_TERM',
            'LOW': 'LONG_TERM'
        }
        return priorities.get(severity, 'MEDIUM_TERM')
    
    def _calculate_risk_score(self, findings):
        """Calculate overall risk score"""
        if not findings:
            return 0.1
        
        total_score = sum(f['risk_score'] for f in findings)
        return min(total_score / len(findings), 1.0)
    
    def _get_risk_level(self, score):
        """Determine risk level from score"""
        if score >= self.thresholds['CRITICAL']:
            return 'CRITICAL'
        elif score >= self.thresholds['HIGH']:
            return 'HIGH'
        elif score >= self.thresholds['MEDIUM']:
            return 'MEDIUM'
        elif score >= self.thresholds['LOW']:
            return 'LOW'
        else:
            return 'MINIMAL'
    
    def _generate_recommendations(self, findings, standard):
        """Generate prioritized recommendations"""
        recommendations = []
        
        # Group by severity
        critical = [f for f in findings if f['severity'] == 'CRITICAL']
        high = [f for f in findings if f['severity'] == 'HIGH']
        
        if critical:
            recommendations.append(
                f'Address {len(critical)} critical findings immediately to avoid {standard} non-compliance.'
            )
        
        if high:
            recommendations.append(
                f'Resolve {len(high)} high-priority issues within 30 days.'
            )
        
        recommendations.extend([
            f'Conduct comprehensive {standard} compliance assessment.',
            'Implement continuous monitoring and regular audits.',
            'Provide staff training on compliance requirements.',
            'Document all remediation activities and controls.'
        ])
        
        return recommendations[:5]
    
    def _generate_summary(self, findings, risk_level, standard):
        """Generate executive summary"""
        if risk_level in ['CRITICAL', 'HIGH']:
            return (f'Significant compliance risks identified in {standard} assessment. '
                   f'{len(findings)} findings require immediate attention. '
                   f'Prioritize critical and high-severity items to reduce risk exposure.')
        elif risk_level == 'MEDIUM':
            return (f'Moderate compliance gaps found in {standard} review. '
                   f'{len(findings)} items need remediation. '
                   f'Implement recommended controls to improve compliance posture.')
        else:
            return (f'{standard} compliance status is generally acceptable. '
                   f'{len(findings)} minor improvements recommended. '
                   f'Continue monitoring and maintaining controls.')
    
    def _calculate_statistics(self, findings):
        """Calculate finding statistics"""
        return {
            'total': len(findings),
            'critical': sum(1 for f in findings if f['severity'] == 'CRITICAL'),
            'high': sum(1 for f in findings if f['severity'] == 'HIGH'),
            'medium': sum(1 for f in findings if f['severity'] == 'MEDIUM'),
            'low': sum(1 for f in findings if f['severity'] == 'LOW')
        }