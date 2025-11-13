from transformers import T5Tokenizer, T5ForConditionalGeneration
import torch
from app.config import Config
from app.utils.logger import get_logger
import re

logger = get_logger(__name__)

class ChecklistGenerator:
    """Generate compliance checklists using T5 model"""
    
    def __init__(self):
        self.model_name = Config.MODEL_NAME
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        logger.info(f'Loading T5 model: {self.model_name} on {self.device}')
        
        self.tokenizer = T5Tokenizer.from_pretrained(self.model_name)
        self.model = T5ForConditionalGeneration.from_pretrained(self.model_name)
        self.model.to(self.device)
        self.model.eval()
        
        self.standards_templates = self._load_standards_templates()
        logger.info('Checklist generator initialized successfully')
    
    def _load_standards_templates(self):
        """Load compliance standards templates"""
        return {
            'ISO_27001': {
                'categories': [
                    'Organizational Controls',
                    'People Controls',
                    'Physical Controls',
                    'Technological Controls'
                ],
                'priority_keywords': ['security', 'access', 'encryption', 'policy', 'risk', 'audit']
            },
            'GDPR': {
                'categories': [
                    'Lawfulness of Processing',
                    'Data Subject Rights',
                    'Security Measures',
                    'Accountability and Governance'
                ],
                'priority_keywords': ['consent', 'data', 'privacy', 'rights', 'breach', 'processor']
            },
            'HIPAA': {
                'categories': [
                    'Administrative Safeguards',
                    'Physical Safeguards',
                    'Technical Safeguards'
                ],
                'priority_keywords': ['health', 'medical', 'patient', 'phi', 'confidentiality', 'integrity']
            },
            'SOC2': {
                'categories': [
                    'Security',
                    'Availability',
                    'Processing Integrity',
                    'Confidentiality',
                    'Privacy'
                ],
                'priority_keywords': ['control', 'monitoring', 'incident', 'testing', 'documentation']
            }
        }
    
    def generate(self, text, standard='ISO_27001'):
        """Generate checklist from document text"""
        try:
            logger.info(f'Generating checklist for {standard}')
            
            # Get standard template
            template = self.standards_templates.get(standard, self.standards_templates['ISO_27001'])
            
            # Analyze text for compliance gaps
            gaps = self._identify_gaps(text, template)
            
            # Generate checklist items
            items = self._generate_items(text, gaps, template, standard)
            
            # Calculate statistics
            total_items = len(items)
            critical_items = sum(1 for item in items if item['priority'] == 'CRITICAL')
            high_items = sum(1 for item in items if item['priority'] == 'HIGH')
            
            result = {
                'success': True,
                'standard': standard,
                'standard_name': Config.COMPLIANCE_STANDARDS[standard]['name'],
                'total_items': total_items,
                'items': items,
                'statistics': {
                    'total': total_items,
                    'critical': critical_items,
                    'high': high_items,
                    'medium': total_items - critical_items - high_items
                },
                'categories': template['categories']
            }
            
            logger.info(f'Generated {total_items} checklist items')
            return result
            
        except Exception as e:
            logger.error(f'Error in checklist generation: {str(e)}')
            raise
    
    def _identify_gaps(self, text, template):
        """Identify compliance gaps in text"""
        gaps = []
        text_lower = text.lower()
        
        priority_keywords = template['priority_keywords']
        
        for keyword in priority_keywords:
            if keyword not in text_lower:
                gaps.append({
                    'keyword': keyword,
                    'severity': 'HIGH' if keyword in ['security', 'encryption', 'consent'] else 'MEDIUM'
                })
        
        return gaps
    
    def _generate_items(self, text, gaps, template, standard):
        """Generate individual checklist items"""
        items = []
        categories = template['categories']
        
        # Generate items based on gaps
        for i, gap in enumerate(gaps[:20]):  # Limit to 20 items
            category = categories[i % len(categories)]
            
            item = {
                'id': f'{standard}_{i+1}',
                'requirement': self._generate_requirement(gap['keyword'], standard),
                'description': self._generate_description(gap['keyword'], standard),
                'category': category,
                'priority': gap['severity'],
                'status': 'NOT_STARTED',
                'control_id': f'{standard[:3]}.{i+1:03d}'
            }
            items.append(item)
        
        # Add general requirements
        general_items = self._get_general_requirements(standard, categories)
        items.extend(general_items)
        
        return items[:30]  # Limit total items
    
    def _generate_requirement(self, keyword, standard):
        """Generate requirement text"""
        requirements = {
            'security': 'Implement comprehensive security controls and policies',
            'access': 'Establish access control mechanisms and authentication procedures',
            'encryption': 'Deploy encryption for data at rest and in transit',
            'policy': 'Develop and maintain security policies and procedures',
            'risk': 'Conduct regular risk assessments and management',
            'audit': 'Implement audit logging and monitoring capabilities',
            'consent': 'Obtain and document user consent for data processing',
            'data': 'Establish data classification and handling procedures',
            'privacy': 'Implement privacy by design principles',
            'rights': 'Provide mechanisms for data subject rights requests',
            'breach': 'Develop incident response and breach notification procedures',
            'processor': 'Establish data processor agreements and oversight',
            'health': 'Protect health information confidentiality',
            'medical': 'Secure medical records and patient data',
            'patient': 'Ensure patient privacy and data protection',
            'phi': 'Safeguard protected health information',
            'confidentiality': 'Maintain confidentiality of sensitive information',
            'integrity': 'Ensure data integrity and accuracy',
            'control': 'Implement and document internal controls',
            'monitoring': 'Establish continuous monitoring and alerting',
            'incident': 'Develop incident management procedures',
            'testing': 'Conduct regular security testing and assessments',
            'documentation': 'Maintain comprehensive documentation of controls'
        }
        return requirements.get(keyword, f'Address {keyword} requirements for {standard}')
    
    def _generate_description(self, keyword, standard):
        """Generate detailed description"""
        return f'Ensure compliance with {standard} requirements related to {keyword}. ' \
               f'Review current implementation and document any gaps or deficiencies.'
    
    def _get_general_requirements(self, standard, categories):
        """Get standard general requirements"""
        general = []
        base_requirements = [
            'Document security baseline and standards',
            'Conduct security awareness training',
            'Implement change management procedures',
            'Establish vendor risk management',
            'Perform regular compliance assessments'
        ]
        
        for i, req in enumerate(base_requirements):
            general.append({
                'id': f'{standard}_GEN_{i+1}',
                'requirement': req,
                'description': f'General {standard} compliance requirement',
                'category': categories[i % len(categories)],
                'priority': 'MEDIUM',
                'status': 'NOT_STARTED',
                'control_id': f'{standard[:3]}.GEN.{i+1:02d}'
            })
        
        return general