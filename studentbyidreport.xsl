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
        <xsl:apply-templates select="StudentReport/Students/Campus"/>
	</body>
	</html>
</xsl:template>
<xsl:template match="Campus">
<!--
<xsl:variable name="startDate" as="xs:dateTime" select="xs:dateTime(StartDate)"/>
<xsl:variable name="endDate" as="xs:dateTime" select="xs:dateTime(EndDate)"/>
-->
<h2>Campus időtartama: <xsl:value-of select="format-dateTime($startDate,'[Y0001].[M01].[D01]')"/>-
<xsl:value-of select="format-dateTime($endDate,'[Y0001].[M01].[D01]')"/>
</h2>
 <xsl:apply-templates select="CampusParticipations/ProjectCampus"/>
</xsl:template>

<xsl:template match="ProjectCampus">
   <p>Project neve: <xsl:value-of select="Projects/Name"/></p>
   <p>Project leírás: <xsl:value-of select="Projects/Description"/></p>
   <xsl:for-each select="ProjectLeaders">
   <xsl:variable name="ProjectLeaderId" select="ProjectLeaderId"/>
      <p>Mentor neve: <xsl:value-of select="ProjectLeaderId"/></p>
	  Értékelés:
	  <ul>
	   <xsl:for-each select="../ProjectMeetings/TeamMemberParticipationMeetings/TeamMemberRatings[ProjectLeaderId=$ProjectLeaderId]">
	   <li>
	      <xsl:value-of select="Text"/>
	   </li>
	   </xsl:for-each>
	  </ul>
   </xsl:for-each>
</xsl:template>

</xsl:stylesheet>