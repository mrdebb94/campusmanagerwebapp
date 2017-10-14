using System;
using System.Collections.Generic; 
using EvoManager.Models;

namespace EvoManager.ViewModels
{
	public class ProjectViewModel {

		public string ProjectCampusId { get; set;}
		public string ProjectId { get; set;}
		public string Name { get; set; }
		public string Description { get; set; }

		public ProjectStatus ProjectStatus { get; set; }
	    public Campus Campus { get; set; }
		
	}
}