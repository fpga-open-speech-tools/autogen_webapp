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
                sh 'Compress-Archive -Path .\bin\Debug\netcoreapp3.1\linux-arm\publish -DestinationPath .\frost_web_app.zip'
            }
        }
        stage('Archive')
        {
            steps
            {
                archiveArtifacts artifacts: 'frost_web_app.zip', fingerprint: true
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