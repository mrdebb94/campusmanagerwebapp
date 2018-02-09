<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
xmlns:xs="http://www.w3.org/2001/XMLSchema">
<xsl:output method="html"
encoding="UTF-8" indent="yes"/>

<xsl:template match="/">
	<html>
	<head>
		<title>
		Campus diák report
		</title>
	</head>
	<body>
	   <h3>Tanuló neve:<xsl:value-of select="StudentReport/Students/Name"/></h3>

	</body>
	</html>
</xsl:template>

</xsl:stylesheet>