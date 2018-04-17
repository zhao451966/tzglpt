// API for projects.service.js
(function() {
    'use strict';

    angular
        .module('appTest')
        .run(projectsServiceMock);

    /* @ngInject */
    function projectsServiceMock($httpBackend, mockData) {
        $httpBackend.whenGET('/api/projects').respond(getProjectsHandler);
        $httpBackend.whenGET(/api\/projects\/\d+\/targets/).respond(getProjectsTargetsHandler);
        $httpBackend.whenGET(/api\/projects\/\d+/).respond(getProjectsDetailHandler);
        $httpBackend.whenPOST('/api/projects').respond(addNewProjectsHandler);
        $httpBackend.whenPUT(/api\/projects\/\d+/).respond(updateProjectDetailHandler);
        $httpBackend.whenDELETE(/api\/projects\/\d+/).respond(removeProjectHandler);

        function getProjectsHandler(method, url) {
            console.log(method, url);

            return [200, {code: 0, message: null, result: mockData.projects}];
        }

        function getProjectsTargetsHandler(method, url) {
            console.log(method, url);

            return [200, {code: 0, message: null, result: mockData.targets}];
        }

        function getProjectsDetailHandler(method, url) {
            console.log(method, url);

            var matches = url.match(/^\/api\/projects\/(\d+)/);
            var id;
            var targetProject;
            if (matches.length === 2) {
                id = matches[1];
                targetProject = _getProjectById(id);
                if (targetProject) {
                    return [200, {code: 0, message: null, result: targetProject}];
                }
            }
        }

        function addNewProjectsHandler(method, url, data) {
            console.log(method, url, data);

            return [200, {code: 0, message: '成功新建项目！', result: {}}];
        }

        function updateProjectDetailHandler(method, url, data) {
            console.log(method, url, data);

            return [200, {code: 0, message: '成功编辑项目！', result: {}}];
        }

        function removeProjectHandler(method, url, data) {
            console.log(method, url, data);
            return [200, {code: 0, message: null, result: {}}];
        }

        function _getProjectById (id) {
            var p = mockData.projects.filter(function (project) {
                return project.id === id;
            });

            return p.length > 0 ? p[0] : mockData.projects[0];
        }
    }
})();