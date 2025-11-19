use anchor_lang::prelude::*;

declare_id!("BJ6fL2BsUqkRbqXEeQ4mQ6HLens4jYEqmwQg3yFkbSrF");

#[program]
pub mod cryptozombies {
    use super::*;

    pub fn initialize(
        ctx: Context<Initialize>,
        level_up_fee_lamports: u64,
    ) -> Result<()> {
        let global_state = &mut ctx.accounts.global_state;

        global_state.admin = ctx.accounts.admin.key();
        global_state.level_up_fee_lamports = level_up_fee_lamports;
        global_state.next_zombie_id = 1;
        global_state.paused = false;
        global_state.bump = ctx.bumps.global_state;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = admin,
        seeds = [GlobalState::SEED],
        bump,
        space = GlobalState::SPACE,
    )]
    pub global_state: Account<'info, GlobalState>,
    #[account(mut)]
    pub admin: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct GlobalState {
    pub admin: Pubkey,
    pub level_up_fee_lamports: u64,
    pub next_zombie_id: u32,
    pub paused: bool,
    pub bump: u8,
    pub _reserved: [u8; 2],
}

impl GlobalState {
    pub const SEED: &'static [u8] = b"global-state";
    pub const SPACE: usize = 8 /* discriminator */
        + 32 /* admin */
        + 8 /* level_up_fee */
        + 4 /* next_zombie_id */
        + 1 /* paused */
        + 1 /* bump */
        + 2; /* reserved */
}
