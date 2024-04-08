export class LoggerUser
{
  constructor(public id: number,
    public username: string,
    public roles: string[],
    private _token: string,
    public _expiration: Date)
  {}

  get token()
  {
    if(!this._expiration || new Date() > this._expiration)
    {
      return null;
    }

    return this._token;
  }
}
