using System;
using System.Collections.Generic; 

namespace EvoManager.Models
{
	public class Campus
	{
		/*public Campus() {
			
		}*/
		
		public string CampusId { get; set; }
		public DateTime StartDate { get; set; }
		public DateTime EndDate { get; set; }
		
		//public bool Active { get; set; }
		
		public virtual ICollection<CampusState> CampusStates { get; set; }
		public virtual ICollection<Project> Projects { get; set; }
		public virtual ICollection<CampusParticipation> CampusParticipations { get; set; }
		public virtual ICollection<StudentRating> StudentRatings { get; set; }
		public virtual ICollection<CampusEvent> CampusEvents { get; set; }
	}
}