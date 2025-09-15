// This is a simulation of the backend services for the Smart Tourist Safety System
// In a real implementation, this would be a Node.js/Express server with proper database connections

class TouristSafetyBackend {
    constructor() {
        this.users = [];
        this.alerts = [];
        this.incidents = [];
        this.safeZones = [];
        this.initializeData();
    }

    initializeData() {
        // Initialize sample data
        this.users = [
            { id: 1, name: "Amit Sharma", email: "amit.sharma@police.gov.in", role: "police", status: "active" },
            { id: 2, name: "Priya Kumar", email: "priya.kumar@tourism.gov.in", role: "admin", status: "active" },
            { id: 3, name: "Rahul Jain", email: "rahul.jain@example.com", role: "tourist", status: "active" }
        ];

        this.alerts = [
            { id: 1, type: "emergency", message: "Medical emergency near Taj Mahal", location: "Taj Mahal, Agra", timestamp: new Date(), status: "active" },
            { id: 2, type: "warning", message: "Heavy traffic on Delhi-Jaipur highway", location: "Delhi-Jaipur Highway", timestamp: new Date(), status: "active" }
        ];

        this.incidents = [
            { id: "#INC001", type: "Medical", location: "Taj Mahal, Agra", status: "active", time: "2 min ago" },
            { id: "#INC002", type: "Theft", location: "Connaught Place, Delhi", status: "resolved", time: "1 hour ago" }
        ];

        this.safeZones = [
            { name: "Central Police Station", location: [28.6139, 77.2090], type: "Police" },
            { name: "City Hospital", location: [28.7041, 77.1025], type: "Medical" },
            { name: "Tourist Information Center", location: [28.5355, 77.3910], type: "Information" },
            { name: "Emergency Shelter", location: [28.4595, 77.0266], type: "Shelter" }
        ];
    }

    // User Management
    getAllUsers() {
        return this.users;
    }

    getUserById(id) {
        return this.users.find(user => user.id === id);
    }

    createUser(userData) {
        const newUser = {
            id: this.users.length + 1,
            ...userData,
            status: "active",
            createdAt: new Date()
        };
        this.users.push(newUser);
        return newUser;
    }

    updateUser(id, userData) {
        const userIndex = this.users.findIndex(user => user.id === id);
        if (userIndex !== -1) {
            this.users[userIndex] = { ...this.users[userIndex], ...userData };
            return this.users[userIndex];
        }
        return null;
    }

    deleteUser(id) {
        const userIndex = this.users.findIndex(user => user.id === id);
        if (userIndex !== -1) {
            const deletedUser = this.users.splice(userIndex, 1)[0];
            return deletedUser;
        }
        return null;
    }

    // Alert Management
    getAllAlerts() {
        return this.alerts;
    }

    getAlertById(id) {
        return this.alerts.find(alert => alert.id === id);
    }

    createAlert(alertData) {
        const newAlert = {
            id: this.alerts.length + 1,
            ...alertData,
            timestamp: new Date(),
            status: "active"
        };
        this.alerts.unshift(newAlert);
        return newAlert;
    }

    updateAlertStatus(id, status) {
        const alertIndex = this.alerts.findIndex(alert => alert.id === id);
        if (alertIndex !== -1) {
            this.alerts[alertIndex].status = status;
            return this.alerts[alertIndex];
        }
        return null;
    }

    // Incident Management
    getAllIncidents() {
        return this.incidents;
    }

    getIncidentById(id) {
        return this.incidents.find(incident => incident.id === id);
    }

    createIncident(incidentData) {
        const newIncident = {
            id: `#INC${String(this.incidents.length + 1).padStart(3, '0')}`,
            ...incidentData,
            time: "Just now",
            status: "active"
        };
        this.incidents.unshift(newIncident);
        return newIncident;
    }

    updateIncidentStatus(id, status) {
        const incidentIndex = this.incidents.findIndex(incident => incident.id === id);
        if (incidentIndex !== -1) {
            this.incidents[incidentIndex].status = status;
            return this.incidents[incidentIndex];
        }
        return null;
    }

    // Safe Zones Management
    getAllSafeZones() {
        return this.safeZones;
    }

    getSafeZonesByLocation(lat, lng, radius = 5) {
        return this.safeZones.filter(zone => {
            const distance = this.calculateDistance(lat, lng, zone.location[0], zone.location[1]);
            return distance <= radius;
        });
    }

    // Utility Functions
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of the earth in km
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        const d = R * c; // Distance in km
        return d;
    }

    deg2rad(deg) {
        return deg * (Math.PI/180);
    }

    // Statistics
    getStatistics() {
        return {
            totalUsers: this.users.length,
            activeUsers: this.users.filter(user => user.status === "active").length,
            totalAlerts: this.alerts.length,
            activeAlerts: this.alerts.filter(alert => alert.status === "active").length,
            totalIncidents: this.incidents.length,
            resolvedIncidents: this.incidents.filter(incident => incident.status === "resolved").length,
            totalSafeZones: this.safeZones.length
        };
    }

    // Simulate real-time updates
    startRealTimeUpdates() {
        setInterval(() => {
            // Simulate random alerts
            if (Math.random() > 0.8) {
                const alertTypes = ["emergency", "warning", "info"];
                const messages = [
                    "Medical emergency reported",
                    "Weather warning issued",
                    "Traffic congestion detected",
                    "Safety checkpoint established"
                ];
                const locations = ["Taj Mahal", "India Gate", "Connaught Place", "Red Fort"];
                
                this.createAlert({
                    type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
                    message: messages[Math.floor(Math.random() * messages.length)],
                    location: locations[Math.floor(Math.random() * locations.length)]
                });
            }
        }, 30000); // Every 30 seconds
    }
}

// API Routes Simulation
class APISimulation {
    constructor(backend) {
        this.backend = backend;
    }

    // User APIs
    async getUsers() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    success: true,
                    data: this.backend.getAllUsers()
                });
            }, 300);
        });
    }

    async createUser(userData) {
        return new Promise(resolve => {
            setTimeout(() => {
                const user = this.backend.createUser(userData);
                resolve({
                    success: true,
                    data: user,
                    message: "User created successfully"
                });
            }, 300);
        });
    }

    // Alert APIs
    async getAlerts() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    success: true,
                    data: this.backend.getAllAlerts()
                });
            }, 300);
        });
    }

    async createAlert(alertData) {
        return new Promise(resolve => {
            setTimeout(() => {
                const alert = this.backend.createAlert(alertData);
                resolve({
                    success: true,
                    data: alert,
                    message: "Alert created successfully"
                });
            }, 300);
        });
    }

    // Incident APIs
    async getIncidents() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    success: true,
                    data: this.backend.getAllIncidents()
                });
            }, 300);
        });
    }

    async createIncident(incidentData) {
        return new Promise(resolve => {
            setTimeout(() => {
                const incident = this.backend.createIncident(incidentData);
                resolve({
                    success: true,
                    data: incident,
                    message: "Incident created successfully"
                });
            }, 300);
        });
    }

    // Safe Zone APIs
    async getSafeZones() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    success: true,
                    data: this.backend.getAllSafeZones()
                });
            }, 300);
        });
    }

    async getNearbySafeZones(lat, lng, radius = 5) {
        return new Promise(resolve => {
            setTimeout(() => {
                const safeZones = this.backend.getSafeZonesByLocation(lat, lng, radius);
                resolve({
                    success: true,
                    data: safeZones
                });
            }, 300);
        });
    }

    // Statistics API
    async getStatistics() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    success: true,
                    data: this.backend.getStatistics()
                });
            }, 300);
        });
    }
}

// Initialize the backend and API simulation
const touristSafetyBackend = new TouristSafetyBackend();
const api = new APISimulation(touristSafetyBackend);

// Start real-time updates
touristSafetyBackend.startRealTimeUpdates();

// Export for use in other files
window.touristSafetyBackend = touristSafetyBackend;
window.api = api;

// WebSocket simulation for real-time updates
class WebSocketSimulation {
    constructor() {
        this.listeners = {};
    }

    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    emit(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => {
                callback(data);
            });
        }
    }

    // Simulate receiving real-time alerts
    startSimulation() {
        setInterval(() => {
            if (Math.random() > 0.7) {
                this.emit('newAlert', {
                    type: "emergency",
                    message: "Real-time emergency alert",
                    location: "Sample Location",
                    timestamp: new Date()
                });
            }
        }, 20000); // Every 20 seconds
    }
}

// Initialize WebSocket simulation
const websocket = new WebSocketSimulation();
websocket.startSimulation();

// Export WebSocket simulation
window.websocket = websocket;
