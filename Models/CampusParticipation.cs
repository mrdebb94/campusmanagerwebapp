using System;

namespace EvoManager.Models {
	public class CampusParticipation {
		
	    public string CampusParticipationId { get; set; }
      
      public string CampusId { get; set; }
      public virtual Campus Campus { get; set; }

      public string MentorId { get; set; }
      public virtual Mentor Mentor { get; set; }

      public string StudentId { get; set; }
      public virtual Student Student { get; set; }  
		
	}
}