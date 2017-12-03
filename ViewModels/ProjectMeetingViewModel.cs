using System;
using System.Collections.Generic; 
using EvoManager.Models; 

namespace EvoManager.ViewModels 
{
	public class ProjectMeetingViewModel
    {
        public string ProjectMeetingId { get; set; }
	
		public string ProjectCampusId { get; set; }
		
		public DateTime StartTime { get; set; }
		public DateTime EndTime { get; set; }
		
		public string Description { get; set; }
		public string Room { get; set; }
		
		public bool IsCancelled { get; set; }

        public bool HasWeekly { get; set; }

		public List<TeamMemberParticipationMeetingViewModel> TeamMemberParticipationMeetings { get; set; }
		public List<ProjectLeaderParticipationMeetingViewModel> ProjectLeaderParticipationMeetings { get; set; }

    }
}