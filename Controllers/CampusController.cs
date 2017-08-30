using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using EvoManager.Models;
using Serilog;

namespace EvoManager.Controllers
{
    [Route("api/[controller]")]
    public class CampusController : Controller
    {
      private EvoDbContext _context;
	  
	  public CampusController(EvoDbContext context) {
		  _context = context;  
	  }
	
	  [HttpGet("[action]")]
	  public IEnumerable<Campus> List() {
		 
		 return _context.Campus.ToList();
		  
	  }	
	  
	   [HttpPost("[action]")]
	   public IActionResult Add([FromBody][Bind("StartDate", "EndDate","Active")] Campus campus) {
		 
		 String guid = Guid.NewGuid().ToString();
		 campus.CampusId=guid;
		 
         Log.Information("Campus data: " + campus.CampusId + " " + 
         campus.StartDate.ToString() + " " + campus.EndDate.ToString() + " " + campus.Active);

		 _context.Campus.Add(campus);
	     _context.SaveChanges();

		 return Ok();	  
	  
	  }
	  
	}
}