using System;

namespace EvoManager.Models
{
	public class Task
	{
		public string TaskId { get; set; }
		
		public string TeamMemberId { get; set; }
		public virtual TeamMember TeamMember { get; set;} 
		
		public string ProjectLeaderId { get; set; }
		public virtual ProjectLeader ProjectLeader { get; set;} 
		
		public string ProjectCampusId { get; set; }
		public virtual ProjectCampus ProjectCampus { get; set; }
		
		public bool Status { get; set; }
		public bool Accept { get; set; }
		
		public string Title { get; set; }
		public string Description { get; set; }
		
		public DateTime CreatedDate { get; set; }
		public string TfsWorkItemId { get; set; }
	}	
}