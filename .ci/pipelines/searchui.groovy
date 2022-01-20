@Library(['estc', 'entsearch']) _

eshPipeline(
    timeout: 45,
    project_name: 'Search UI',
    repository: 'searchui',
    stage_name: 'Search UI Unit Tests',
    stages: [

        [
            name: 'Run tests',
            type: 'script',
            label: 'Run tests',
            script: {
                sh "docker run --rm -v `pwd`:/ci -w=/ci node:14.17 npm install && npm run test-ci"
            },
            match_on_all_branches: true,
        ]
    ],
    slack_channel: 'search-ui'
)
