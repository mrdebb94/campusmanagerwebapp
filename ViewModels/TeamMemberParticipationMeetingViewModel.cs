using System;
using System.Collections.Generic; 
using EvoManager.Models;

namespace EvoManager.ViewModels
{
    public class TeamMemberParticipationMeetingViewModel {
       public string TeamMemberParticipationMeetingId { get; set; }
       public bool Planned { get; set; }
       public bool Checked { get; set; }
       public string TeamMemberId { get; set; }
       public string TeamMemberName { get; set; }
    }
}