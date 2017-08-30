using System;
using System.Collections.Generic; 

namespace EvoManager.Models {
	
	public class TeamMemberRating {
		
		public string TeamMemberRatingId { get; set; }
		
		public string TeamMemberParticipationMeetingId { get; set; }
		public virtual TeamMemberParticipationMeeting TeamMemberParticipationMeeting { get; set; }
		
	    public bool Active { get; set; }
		public string Text { get; set; }
		
		public string ProjectLeaderId { get; set; }
		public virtual ProjectLeader ProjectLeader { get; set; }
		
	}
	
}