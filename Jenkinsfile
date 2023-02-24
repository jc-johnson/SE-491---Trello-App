pipeline {

	agent any

	tools {nodejs "node"}
	
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
				sh 'npm install'
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
