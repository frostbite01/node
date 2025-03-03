const express = require('express');
const router = express.Router();
const { authenticate, isAdmin, isUser } = require('../middlewares/auth');

// Import controllers
const switchController = require('../controllers/switchController');
const printerController = require('../controllers/printerController');
const laptopController = require('../controllers/laptopController');
const pcController = require('../controllers/pcController');
const peripheralController = require('../controllers/peripheralController');
const softwareController = require('../controllers/softwareController');
const cctvNvrController = require('../controllers/cctvNvrController');
const routerController = require('../controllers/routerController');
const wirelessDeviceController = require('../controllers/wirelessDeviceController');
const accessPointController = require('../controllers/accessPointController');

// Create a function to set up standard routes for each inventory item
const setupStandardRoutes = (baseUrl, controller) => {
  // Get all items - accessible by admin and regular users
  router.get(`/${baseUrl}`, authenticate, isUser, controller.getAll);
  
  // Get item by ID - accessible by admin and regular users
  router.get(`/${baseUrl}/:id`, authenticate, isUser, controller.getById);
  
  // Create new item - admin only
  router.post(`/${baseUrl}`, authenticate, isAdmin, controller.create);
  
  // Update item - admin only
  router.put(`/${baseUrl}/:id`, authenticate, isAdmin, controller.update);
  
  // Delete item - admin only
  router.delete(`/${baseUrl}/:id`, authenticate, isAdmin, controller.delete);
  
  // Get items by status - accessible by admin and regular users
  router.get(`/${baseUrl}/status/:status`, authenticate, isUser, controller.getByStatus);
  
  // Get items by assigned user - accessible by admin and regular users
  if (controller.getByAssignedUser) {
    router.get(`/${baseUrl}/assigned/:username`, authenticate, isUser, controller.getByAssignedUser);
  }
};

// Set up routes for each inventory item
setupStandardRoutes('switches', switchController);
setupStandardRoutes('printers', printerController);
setupStandardRoutes('laptops', laptopController);
setupStandardRoutes('pcs', pcController);
setupStandardRoutes('peripherals', peripheralController);
setupStandardRoutes('software', softwareController);
setupStandardRoutes('cctv-nvr', cctvNvrController);
setupStandardRoutes('routers', routerController);
setupStandardRoutes('wireless-devices', wirelessDeviceController);
setupStandardRoutes('access-points', accessPointController);

// Special routes for specific inventory items
router.get('/switches/vlan/:supported', authenticate, isUser, switchController.getByVlanSupport);
router.get('/printers/network/:enabled', authenticate, isUser, printerController.getByNetworkEnabled);
router.get('/peripherals/type/:type', authenticate, isUser, peripheralController.getByType);

module.exports = router; 