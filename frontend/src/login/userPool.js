import { CognitoUserPool } from 'amazon-cognito-identity-js'

const poolData = {
  UserPoolId: 'eu-central-1_y0mzn8wk9',
  ClientId: '3jbfhtqj76ih9p7ahgs3ugahnc',
}

export default new CognitoUserPool(poolData)
