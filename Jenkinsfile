pipeline {

	agent any

	tools {nodejs "nodejs"}
	
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
				sh 'npm config ls'
				echo 'Installing npm...'
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
