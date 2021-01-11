pipeline
{
    agent {label 'Windows_Node2'}
    stages
    {
        stage('Build Frost Web App')
        {
            steps
            {   
                sh 'dotnet publish -c Debug -r linux-arm;'
            }
        }

        stage('Zip Frost Web App')
        {
            steps
            {
                dir("bin/Debug/netcoreapp3.1/linux-arm/")
                {
                    bat label: '', script: 'ubuntu.exe run zip -r frost_web_app.zip publish'
                }

            }
        }
        stage('Archive')
        {
            steps
            {
                dir("bin/Debug/netcoreapp3.1/linux-arm/")
                {
                    archiveArtifacts artifacts: 'frost_web_app.zip', fingerprint: true
                }
            }
        }
        stage('Cleanup Workspace')
        {
            steps
            {
                cleanWs()
                dir("${env.WORKSPACE}@tmp") {
                    deleteDir()
                }
            }
        }
    }
}