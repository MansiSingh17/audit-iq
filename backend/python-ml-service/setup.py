"""
Setup configuration for AuditIQ ML Service
"""
from setuptools import setup, find_packages

setup(
    name='auditiq-ml-service',
    version='1.0.0',
    description='AuditIQ AI-Powered Audit Quality Assistant - ML Service',
    author='AuditIQ Team',
    author_email='support@auditiq.com',
    packages=find_packages(),
    install_requires=[
        'Flask>=3.0.0',
        'Flask-CORS>=4.0.0',
        'transformers>=4.35.0',
        'torch>=2.1.0',
        'sentencepiece>=0.1.99',
        'language-tool-python>=2.7.1',
        'PyPDF2>=3.0.1',
        'python-docx>=1.1.0',
        'openpyxl>=3.1.2',
        'pandas>=2.1.3',
        'numpy>=1.26.2',
        'redis>=5.0.1',
        'python-dotenv>=1.0.0',
        'colorlog>=6.8.0',
    ],
    extras_require={
        'dev': [
            'pytest>=7.4.3',
            'pytest-cov>=4.1.0',
            'black>=23.11.0',
            'flake8>=6.1.0',
            'mypy>=1.7.0',
        ]
    },
    python_requires='>=3.9',
    classifiers=[
        'Development Status :: 4 - Beta',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: MIT License',
        'Programming Language :: Python :: 3.9',
        'Programming Language :: Python :: 3.10',
        'Programming Language :: Python :: 3.11',
    ],
)