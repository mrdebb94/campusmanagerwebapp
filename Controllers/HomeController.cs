using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace EvoManager.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index( [FromServices] EvoDbContext context)
        {
            return View();
        }

        public IActionResult Error()
        {
            ViewData["RequestId"] = Activity.Current?.Id ?? HttpContext.TraceIdentifier;
            return View();
        }
    }
}
