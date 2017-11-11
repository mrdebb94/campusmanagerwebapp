using System;
using System.Collections.Generic; 
using EvoManager.Models;

namespace EvoManager.ViewModels
{
    public class ProjectLeaderParticipationMeetingViewModel {
       public string ProjectLeaderParticipationMeetingId { get; set; }
       public bool Planned { get; set; }
       public bool Checked { get; set; }
       public string ProjectLeaderId { get; set; }
       public string ProjectLeaderName { get; set; }
    }
}