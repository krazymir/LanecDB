# LanecDB
**LanecDB** is an attempt at creating a distributed database, based on blockchain, allowing for shared knowledge, that cannot be easily altered.
The data can be written by anyone and changed either by all or by the owner, depending on the configuration.
Gossip techniques are used for propagation of information.
The database will be available as an npm package, allowing for cross-platform usage.
Aside from blockchain it relies on proof of work, gossip data dissemenation, RSA public/private cryptography for data encryption and digital signatures, and other tech. 
The design is heavily influenced by
- [Bitcoin core software](https://github.com/bitcoin/bitcoin)
- The articles on [Bits on blocks](https://bitsonblocks.net/)
- And here - [Bitcoin wiki](https://en.bitcoin.it/), primarily on how nodes discover one another

The database is an attempt to resolve issues, such as honest, secure, tamper-proof online voting, preserving the vote secrecy, B2B communication and data exchanges and others.
Remember - it's still work in progress.
And as Kafka said:
> Believing in progress does not mean believing that any progress has yet been made.
