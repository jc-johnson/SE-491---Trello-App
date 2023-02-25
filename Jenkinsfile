pipeline {

	agent any
	
	stages {

		stage(“clone”) {
					
			steps {
				echo 'Cloning from git'
				checkout([$class: 'GitSCM', branches: [[name: '*/main']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[url: 'https://github.com/jc-johnson/SE-491---Trello-App.git']]])
			}
		}
				
		stage(“install”) {
					
			steps {
				nodejs(NodeInstance: 'Node 18.x') {
                    			sh 'npm config ls'
                		}
			}
		}
				
		stage(“test”) {
					
			steps {
				echo 'testing the application...'
				sh 'npm test'
			}
		}
	}
}
