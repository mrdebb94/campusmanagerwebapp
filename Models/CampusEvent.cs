using System;
using System.Collections.Generic; 

namespace EvoManager.Models {
	
	public class CampusEvent {
		
		public string CampusEventId { get; set; }
		
		public virtual Campus Campus { get; set; }
		public string CampusId { get; set; }
		
		public DateTime StartTime { get; set; }
		public DateTime EndTime { get; set; }
		
		public string Description { get; set; }
		public string Room { get; set; }
		public string Title { get; set; }
		
		public bool IsCancelled { get; set; }
		
		public virtual ICollection<User> User { get; set; }
			
	} 
	
}