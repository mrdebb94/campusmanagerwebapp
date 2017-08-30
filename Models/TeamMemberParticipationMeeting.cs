using System;
using System.Collections.Generic;

namespace EvoManager.Models {

  public class TeamMemberParticipationMeeting {
	  public string TeamMemberParticipationMeetingId { get; set; }
	  
	  public string TeamMemberId { get; set; }
	  public virtual TeamMember TeamMember { get; set; }
	  
	  public string ProjectMeetingId { get; set; }
	  public virtual ProjectMeeting ProjectMeeting { get; set; }
	  
	  public bool Planned { get; set; }
	  public bool Checked { get; set; }
	  
	  public virtual ICollection<TeamMemberRating> TeamMemberRatings { get; set; } 
	  
  }



}