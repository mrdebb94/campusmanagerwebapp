using System;
using System.Collections.Generic; 

namespace EvoManager.Models 
{
	public class SubscribedStudentViewModel
    {
        public string SubscribedStudentId { get; set; }
        public string ProjectCampusId { get; set; }

        public Student Student { get; set; }
    }
}