using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using EvoManager.Models;
using EvoManager.ViewModels;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Http;
using Serilog;

[Route("api/[controller]")]
public class XsrfTokenController : Controller
{
    private readonly IAntiforgery _antiforgery;
 
    public XsrfTokenController(IAntiforgery antiforgery)
    {
        _antiforgery = antiforgery;
    }
 
    [HttpGet("[action]")]
    public IActionResult Get()
    {
        var tokens = _antiforgery.GetAndStoreTokens(HttpContext);
 
        /*return new ObjectResult(new {
            token = tokens.RequestToken,
            tokenName = tokens.HeaderName
        });*/

        this.HttpContext.Response.Cookies.Append("XSRF-TOKEN", tokens.RequestToken, 
                        new CookieOptions() { HttpOnly = false });
        
        return Ok();

    }
}