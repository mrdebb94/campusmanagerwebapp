using System;
using System.Collections.Generic;

namespace EvoManager.ViewModels
{
	public class UserForm {

        public UserForm()
        {
			this.UserName="";
            this.Name="";
            this.Password="";
            this.Email="";
        }

		public string UserName { get; set; }
        public string Name { get; set; }
		public string Password { get; set; }
		public string Email { get; set; }
		public List<string> Roles { get; set; }
		
	}
}