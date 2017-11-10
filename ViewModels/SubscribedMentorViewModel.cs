using System;
using System.Collections.Generic; 

namespace EvoManager.Models 
{
	public class SubscribedMentorViewModel
    {
        public string SubscribedMentorId { get; set; }
        //public string ProjectCampusId { get; set; }

        public Mentor Mentor { get; set; }
    }
}