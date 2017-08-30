using System;
using System.Collections.Generic; 

namespace EvoManager.Models {
	
	public class StudentRating {
		
		public string StudentRatingId { get; set; }
		
	    public bool Active { get; set; }
		public string Text { get; set; }
		
		public string MentorId { get; set; }
		public virtual Mentor Mentor { get; set; }
		
		public string StudentId { get; set; }
		public virtual Student Student { get; set; }
		
	    public string CampusId { get; set; }
		public virtual Campus Campus { get; set; }
		
	}
	
}