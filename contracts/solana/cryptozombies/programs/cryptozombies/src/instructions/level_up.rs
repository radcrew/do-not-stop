use anchor_lang::{prelude::*, solana_program::system_program};

use crate::state::{GlobalState, ZombieAccount};

pub fn handler(ctx: Context<LevelUp>) -> Result<()> {
    let global_state = &mut ctx.accounts.global_state;
    let zombie = &mut ctx.accounts.zombie;

    require_keys_eq!(
        zombie.owner,
        ctx.accounts.owner.key(),
        LevelUpError::Unauthorized
    );

    // transfer lamports to global state (program-owned)
    let fee = global_state.level_up_fee_lamports;
    require!(fee > 0, LevelUpError::InvalidFee);

    let cpi_ctx = CpiContext::new(
        ctx.accounts.system_program.to_account_info(),
        anchor_lang::system_program::Transfer {
            from: ctx.accounts.owner.to_account_info(),
            to: ctx.accounts.global_state.to_account_info(),
        },
    );
    anchor_lang::system_program::transfer(cpi_ctx, fee)?;

    zombie.level = zombie.level.checked_add(1).unwrap();

    Ok(())
}

#[derive(Accounts)]
pub struct LevelUp<'info> {
    #[account(
        mut,
        seeds = [GlobalState::SEED],
        bump = global_state.bump,
    )]
    pub global_state: Account<'info, GlobalState>,
    #[account(
        mut,
        seeds = [ZombieAccount::SEED, owner.key().as_ref(), &zombie.id.to_le_bytes()],
        bump = zombie.bump,
    )]
    pub zombie: Account<'info, ZombieAccount>,
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
}

#[error_code]
pub enum LevelUpError {
    #[msg("Zombie fee invalid")]
    InvalidFee,
    #[msg("Not authorized to level this zombie")]
    Unauthorized,
}

