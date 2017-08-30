using System;
using System.Collections.Generic; 

namespace EvoManager.Models {

  public class ProjectLeaderParticipationMeeting {
	  public string ProjectLeaderParticipationMeetingId { get; set; }
	  
	  public string ProjectLeaderId { get; set; }
	  public virtual ProjectLeader ProjectLeader { get; set; }
	  
	  public string ProjectMeetingId { get; set; }
	  public virtual ProjectMeeting ProjectMeeting { get; set; }
	  
	  public bool Planned { get; set; }
	  public bool Checked { get; set; }
	  
  }
  
}