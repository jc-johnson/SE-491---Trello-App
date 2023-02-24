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
				echo 'Installing npm...'
				nodejs(NodeInstance: 'node19') {
      				sh 'npm -v'  
      				sh 'node -v'
					sh 'npm test'
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
