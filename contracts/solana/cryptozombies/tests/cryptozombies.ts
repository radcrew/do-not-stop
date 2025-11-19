import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Cryptozombies } from "../target/types/cryptozombies";

describe("cryptozombies", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.cryptozombies as Program<Cryptozombies>;

  it("initializes global state", async () => {
    const [globalState] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("global-state")],
      program.programId,
    );

    const tx = await program.methods
      .initialize(new anchor.BN(1_000_000))
      .accounts({
        globalState,
      })
      .rpc();

    console.log("initialized tx", tx);
  });

  it("creates starter zombie", async () => {
    const provider = anchor.getProvider();
    const wallet = provider.wallet as anchor.Wallet;

    const [globalState] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("global-state")],
      program.programId,
    );

    const [playerProfile] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("player-profile"), wallet.publicKey.toBuffer()],
      program.programId,
    );

    const [zombie] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("zombie"),
        wallet.publicKey.toBuffer(),
        new anchor.BN(1).toArrayLike(Buffer, "le", 4),
      ],
      program.programId,
    );

    const tx = await program.methods
      .createStarterZombie("Starter", new anchor.BN(12345), 1)
      .accounts({
        globalState,
        playerProfile,
        zombie,
        owner: wallet.publicKey,
      })
      .rpc();

    console.log("starter zombie tx", tx);
  });

  it("levels up a zombie", async () => {
    const provider = anchor.getProvider();
    const wallet = provider.wallet as anchor.Wallet;

    const [globalState] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("global-state")],
      program.programId,
    );

    const [zombie] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("zombie"),
        wallet.publicKey.toBuffer(),
        new anchor.BN(1).toArrayLike(Buffer, "le", 4),
      ],
      program.programId,
    );

    const tx = await program.methods
      .levelUp()
      .accounts({
        globalState,
        zombie,
        owner: wallet.publicKey,
      })
      .rpc();

    console.log("level up tx", tx);
  });
});
