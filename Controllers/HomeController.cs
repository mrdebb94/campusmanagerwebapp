using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Http;

namespace EvoManager.Controllers
{
    public class HomeController : Controller
    {
        private readonly IAntiforgery _antiForgeryService;
 
        public HomeController(IAntiforgery antiForgeryService)
        {
            _antiForgeryService = antiForgeryService;
        }
    
        public IActionResult Index()
        {
            /*var token = _antiForgeryService.GetAndStoreTokens(HttpContext).RequestToken;
            HttpContext.Response.Cookies.Append("XSRF-TOKEN", token, new CookieOptions { HttpOnly = false });*/

            var tokens =  _antiForgeryService.GetAndStoreTokens(this.HttpContext);
            HttpContext.Response.Cookies.Append("XSRF-TOKEN", tokens.RequestToken, new CookieOptions { HttpOnly = false });
            // Render this token in a div, so our javascript can read it and send it, and send it in the ajax request header where it can be validated against the XSRF-TOKEN cookie
            this.ViewBag.AntiForgeryRequestToken = tokens.RequestToken;

            return View();
        }
    }
}
