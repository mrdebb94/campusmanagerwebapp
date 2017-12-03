using System;
using System.Collections.Generic; 

namespace EvoManager.Models {
	
	public class TeamMemberRatingViewModel {
		
		public string TeamMemberRatingId { get; set; }
			
	    public bool Active { get; set; }
        public bool Editable { get; set; }
		public string Text { get; set; }
		
		public ProjectLeader ProjectLeader { get; set; }
		
	}
	
}