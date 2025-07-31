export const ROUTES = {
    LOGIN: '/login',
    HOME: '/',
    PROFILE:{
        MY_PROFILE: '/profile/my-profile',
    },
    COMPANY: {
        LIST: '/companies/list-companies',
        CREATE: '/companies/create',
        EDIT: '/companies/edit/:uuid',
        DETAILS: '/companies/details/:uuid'
    },
    ACCESS_DENIED: '/access-denied',
    USER: {
        LIST: '/users/list-users',
        CREATE: '/users/create-user',
        EDIT: '/users/edit/:uuid',
        DETAILS: '/users/details/:uuid'
    },
    CAMPAIGN: {
        LIST: '/campaigns/list-campaigns',
        CREATE: '/campaigns/create',
        EDIT: '/campaigns/edit/:uuid',
        DETAILS: '/campaigns/details/:uuid'
    },
}
