import { TicketState } from "../interfaces/ticket_interface";

var axios = require('axios');

const projectKey = process.env.PROJECT_KEY
const username = process.env.ATLASSIAN_USERNAME
const password = process.env.ATLASSIAN_API_KEY
const domain = process.env.DOMAIN

const auth = {
    username: username,
    password: password
};

const JiraService = {
    async createIssue(shortDescription: string, description: string, state: TicketState) {
        const stateToJira = {
            NEW: 21,
            IN_PROGRESS: 11,
            REVIEW: 31,
            DONE: 41,
        }

        try {
            const baseUrl = 'https://' + domain + '.atlassian.net';
            const issueType = 'Task'

            const data = {
                fields: {
                    project: { key: projectKey },
                    summary: shortDescription,
                    description: description,
                    issuetype: { name: issueType }
                },
                transition: {
                    id: stateToJira[state]
                },
            };
            const config = {
                headers: { 'Content-Type': 'application/json' },
                auth: auth
            };
            const response = await axios.post(`${baseUrl}/rest/api/2/issue`, data, config);
            return response.data.key;

        } catch (error: any) {
            console.log('error: ')
            console.log(error.response.data.errors)
        }
    },

    async updateIssue(issueKey: string, shortDescription: string, description: string, state?: TicketState) {
        const stateToJira = {
            NEW: 21,
            IN_PROGRESS: 11,
            REVIEW: 31,
            DONE: 41,
        }
        try {
            const baseUrl = 'https://' + domain + '.atlassian.net';

            const config = {
                headers: { 'Content-Type': 'application/json' },
                auth: auth
            };

            //Body to pass into POST REST API Request
            const data = {
                fields: {
                    summary: shortDescription,
                    description: description,
                }
            };

            //use axios to make post request
            const response = await axios.put(`${baseUrl}/rest/api/2/issue/${issueKey}`, data, config);

            if (state) {
                await this.updateStatus(issueKey, stateToJira[state])
            }

            //if you see that you get status of 204, that means the update worked!
            console.log(response.status)
            return response.status;
        } catch (error: any) {
            console.log('error: ')
            console.log(error.response.data.errors)
        }
    },

    async updateStatus(issueKey: string, statusID: number) {
        try {
            const baseUrl = 'https://' + domain + '.atlassian.net';

            const config = {
                headers: { 'Content-Type': 'application/json' },
                auth: auth
            };

            //Body to pass into POST REST API Request
            const data = {
                transition: {
                    id: statusID
                }
            };

            //use axios to make post request
            const response = await axios.post(`${baseUrl}` + `/rest/api/2/issue/` + issueKey +
                `/transitions`, data, config);

            //if you see that you get status of 204, that means the update worked!
            console.log(response.status)
            return response.status;
        } catch (error: any) {
            console.log('error: ')
            console.log(error.response.data.errors)
        }
    },

    async deleteTicket(issueKey: string) {
        try {
            const baseUrl = 'https://' + domain + '.atlassian.net';

            const config = {
                // headers: { 'Content-Type': 'application/json' },
                auth: auth
            };

            const response = await axios.delete(`${baseUrl}` + `/rest/api/2/issue/` + issueKey, config);

            //if you see that you get status of 204, that means the update worked!
            console.log(response.status)
            return response.status;
        } catch (error: any) {
            console.log('error: ')
            console.log(error.response.data.errors)
        }
    }

}

export default JiraService