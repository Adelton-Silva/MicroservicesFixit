using System.Collections.Generic;

namespace ServiceManagementService.DTOs
{
    public class PagedUserResponseDto
    {
        public List<UserDto> Items { get; set; } = new List<UserDto>();
        public int TotalItems { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
    }
}
