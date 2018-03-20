using System;

namespace EvoManager.Utils
{
	public class JSendResponseType<TData> {
        public int Code { get; set; }
        public string Message { get; set; }
        public string Status { get; set; }
        public TData Data { get; set; }
	}
}