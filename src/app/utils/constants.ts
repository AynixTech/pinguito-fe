export const ROUTES = {
    LOGIN: '/login',
    HOME: '/dashboard',
    PROFILE:{
        MY_PROFILE: '/dashboard/profile/my-profile',
    },
    COMPANY: {
        LIST: '/dashboard/companies/list-companies',
        CREATE: '/dashboard/companies/create-company',
        EDIT: '/dashboard/companies/edit-company/:uuid',
        DETAILS: '/dashboard/companies/details/:uuid'
    },
    USER: {
        LIST: '/dashboard/users/list-users',
        CREATE: '/dashboard/users/create-user',
        EDIT: '/dashboard/users/edit-user/:uuid',
        DETAILS: '/dashboard/users/details/:uuid'
    },
    CAMPAIGN: {
        LIST: '/dashboard/campaigns/list-campaigns',
        CREATE: '/dashboard/campaigns/create-campaign',
        EDIT: '/dashboard/campaigns/edit-campaign/:uuid',
        DETAILS: '/dashboard/campaigns/details/:uuid'
    },
    ACCESS_DENIED: '/dashboard/access-denied',

}
