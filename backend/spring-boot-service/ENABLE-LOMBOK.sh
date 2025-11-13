#!/bin/bash

echo "🔧 Enabling Lombok Annotation Processing in pom.xml"

# Backup pom.xml
cp pom.xml pom.xml.backup

# Find and update maven-compiler-plugin
python3 << 'PYTHON'
import xml.etree.ElementTree as ET

# Parse pom.xml
tree = ET.parse('pom.xml')
root = tree.getroot()

# Define namespace
ns = {'mvn': 'http://maven.apache.org/POM/4.0.0'}

# Find maven-compiler-plugin
for plugin in root.findall('.//mvn:plugin', ns):
    artifact = plugin.find('mvn:artifactId', ns)
    if artifact is not None and artifact.text == 'maven-compiler-plugin':
        config = plugin.find('mvn:configuration', ns)
        if config is None:
            config = ET.SubElement(plugin, 'configuration')
        
        # Add annotationProcessorPaths
        paths = ET.SubElement(config, 'annotationProcessorPaths')
        path = ET.SubElement(paths, 'path')
        ET.SubElement(path, 'groupId').text = 'org.projectlombok'
        ET.SubElement(path, 'artifactId').text = 'lombok'
        ET.SubElement(path, 'version').text = '1.18.30'
        
        print("✅ Added annotationProcessorPaths to maven-compiler-plugin")
        break

# Write back
tree.write('pom.xml', encoding='utf-8', xml_declaration=True)
print("✅ pom.xml updated")

PYTHON

# Format the pom.xml properly
echo "Rebuilding..."
mvn clean install

